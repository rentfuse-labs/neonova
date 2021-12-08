import { sc, u, wallet, experimental } from '@cityofzion/neon-js';
import { waitTx, WitnessScope } from '@rentfuse-labs/neo-wallet-adapter-base';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { useRootStore } from '@stores';
import { useLocalWallet } from '@wallet';
import { Button, Form, message, Result, Typography, Upload } from 'antd';
import { Buffer } from 'buffer';
import { observer } from 'mobx-react-lite';
import { toInvocationArgument } from '@utils';
import React, { useState } from 'react';
import { NETWORK_DATA_MAP } from '@constants';
import { CheckCircleOutlined } from '@ant-design/icons';

export const ContractDeployPanel = observer(function ContractDeployPanel() {
	const { viewStore, settingsStore } = useRootStore();

	const { address, connected, invoke } = useWallet();
	const { account } = useLocalWallet();

	const [form] = Form.useForm();

	// The scripthash of the contract that has been deployed used also to decide result showing
	const [deployedContract, setDeployedContract] = useState<string | null>(null);

	const normalizeFile = (e: any) => {
		// Extract file from event and add it to form values
		return e.file;
	};

	const onFinish = async (values: any) => {
		viewStore.setLoadingVisible(true);

		let contractBytecode: Buffer | null = null;
		let contractManifest: any | null = null;
		// Extract and check completeness of neede files
		if (values.nefFile && values.manifestFile) {
			try {
				// Parse and get contract bytecode
				contractBytecode = await new Promise((resolve) => {
					const reader = new FileReader();
					reader.addEventListener('load', () => {
						resolve(Buffer.from(reader.result as ArrayBuffer));
					});
					reader.readAsArrayBuffer(values.nefFile.originFileObj);
				});
				// Parse and get contract manifest
				contractManifest = await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.addEventListener('load', () => {
						const manifestJson = JSON.parse(reader.result as string);
						if (
							manifestJson.abi &&
							manifestJson.extra &&
							manifestJson.groups &&
							manifestJson.name &&
							manifestJson.permissions &&
							manifestJson.supportedstandards &&
							manifestJson.trusts
						) {
							resolve(sc.ContractManifest.fromJson(manifestJson));
						} else {
							reject();
						}
					});
					reader.readAsText(values.manifestFile.originFileObj);
				});
			} catch (error) {}
		}

		// If can't manage to get them, throw error
		if (!contractBytecode) {
			message.error('An error occurred loading contract NEF file');
			return;
		}
		if (!contractManifest) {
			message.error('An error occurred loading contract manifest file');
			return;
		}

		// All good, let's go with deploy
		const isLocal = settingsStore.network.type === 'LocalNet';
		try {
			if (isLocal) {
				if (!account) {
					message.error('You need to connect a wallet to execute a write invocation');
					return;
				}

				// Deploy with neon way to do things
				const result = await experimental.deployContract(sc.NEF.fromBuffer(contractBytecode), contractManifest, {
					networkMagic: settingsStore.network.networkMagic,
					rpcAddress: settingsStore.network.rpcAddress,
					account: account as any,
				});

				await waitTx(settingsStore.network.rpcAddress, result);

				// Get deployed contract scripthash
				const scriptHash = experimental.getContractHash(
					u.HexString.fromHex(wallet.getScriptHashFromAddress(account.address)),
					sc.NEF.fromBuffer(contractBytecode).checksum,
					contractManifest.name,
				);
				// Set it to show it
				setDeployedContract(scriptHash);
			} else {
				if (!address || !connected) {
					message.error('You need to connect a wallet to execute a write invocation');
					return;
				}

				const result = await invoke({
					scriptHash: NETWORK_DATA_MAP[settingsStore.network.type].nativeContracts['contractManagement'],
					operation: 'deploy',
					args: [
						toInvocationArgument(
							'ByteArray',
							u.HexString.fromHex(sc.NEF.fromBuffer(contractBytecode).serialize(), true),
						),
						toInvocationArgument('String', JSON.stringify(contractManifest.toJson())),
					],
					signers: [
						{
							account: wallet.getScriptHashFromAddress(address),
							scope: WitnessScope.Global,
						},
					],
				});

				if (result.data?.txId) {
					await waitTx(settingsStore.network.rpcAddress, result.data?.txId);

					// Get deployed contract scripthash
					const scriptHash = experimental.getContractHash(
						u.HexString.fromHex(wallet.getScriptHashFromAddress(address)),
						sc.NEF.fromBuffer(contractBytecode).checksum,
						contractManifest.name,
					);
					// Set it to show it
					setDeployedContract(scriptHash);
				} else {
					message.warning('Contract was not deployed due to some problems');
				}
			}
		} catch (error) {
			console.error(error);
			message.error('An error occurred while doing the invocation');
		} finally {
			viewStore.setLoadingVisible(false);
		}
	};

	return (
		<>
			<div className={'m-contract-deploy-panel'}>
				{deployedContract === null ? (
					<Form form={form} layout={'vertical'} onFinish={onFinish} style={{ height: '100%' }}>
						<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
							<Typography.Title level={4}>{'Deploy'}</Typography.Title>

							<div style={{ marginTop: 16 }}>
								<Form.Item
									name={'nefFile'}
									label={'Contract NEF'}
									valuePropName={'nefFile'}
									getValueFromEvent={normalizeFile}
									rules={[{ required: true }]}
								>
									<Upload name={'nefFile'} accept={'.nef'} showUploadList={true} maxCount={1}>
										<Button type={'default'}>Import NEF</Button>
									</Upload>
								</Form.Item>
							</div>

							<div>
								<Form.Item
									name={'manifestFile'}
									label={'Contract manifest'}
									valuePropName={'manifestFile'}
									getValueFromEvent={normalizeFile}
									rules={[{ required: true }]}
								>
									<Upload name={'manifestFile'} accept={'.json'} showUploadList={true} maxCount={1}>
										<Button type={'default'}>Import Manifest</Button>
									</Upload>
								</Form.Item>
							</div>

							<div style={{ flex: 1 }}></div>

							<div>
								<Form.Item style={{ marginBottom: 0 }}>
									<Button htmlType={'submit'} type={'primary'} size={'large'} block={true}>
										{'Deploy'}
									</Button>
								</Form.Item>
							</div>
						</div>
					</Form>
				) : (
					<div
						style={{
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Result
							icon={<CheckCircleOutlined style={{ color: '#00e599' }} />}
							title={'Contract succesfully deployed'}
							subTitle={'Contract scripthash: 0x' + deployedContract}
							extra={[
								<Button type={'primary'} key={'ok'} onClick={() => setDeployedContract(null)}>
									{'Ok'}
								</Button>,
							]}
						/>
					</div>
				)}
			</div>

			<style jsx>{`
				.m-contract-deploy-panel {
					width: 100%;
					height: 100%;
					padding: 16px;
					background: #ffffff;
					border-radius: 4px;
				}
			`}</style>
		</>
	);
});
