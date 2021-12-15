import { CheckCircleOutlined } from '@ant-design/icons';
import Neon, { experimental, sc, u, wallet } from '@cityofzion/neon-js';
import { waitTx, WitnessScope } from '@rentfuse-labs/neo-wallet-adapter-base';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { useRootStore } from '@stores';
import { toInvocationArgument } from '@utils';
import { useLocalWallet } from '@wallet';
import { Button, Form, Input, message, Result, Typography, Upload } from 'antd';
import { Buffer } from 'buffer';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';

export const ContractUpdatePanel = observer(function ContractUpdatePanel() {
	const { viewStore, settingsStore } = useRootStore();

	const { address, connected, invoke } = useWallet();
	const { account } = useLocalWallet();

	const [form] = Form.useForm();

	// The scripthash of the contract that has been updated used also to decide result showing
	const [updatedContract, setUpdatedContract] = useState<string | null>(null);

	const autoRequest = (request: any) => {
		setTimeout(() => {
			request.onSuccess('ok');
		}, 0);
	};

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

				const contract = new Neon.experimental.SmartContract(Neon.u.HexString.fromHex(values.scriptHash), {
					networkMagic: settingsStore.network.networkMagic,
					rpcAddress: settingsStore.network.rpcAddress,
					account: account as any,
				});
				const result = await contract.invoke('update', [
					toInvocationArgument('ByteArray', u.HexString.fromHex(sc.NEF.fromBuffer(contractBytecode).serialize(), true)),
					toInvocationArgument('String', JSON.stringify(contractManifest.toJson())),
				] as any);

				await waitTx(settingsStore.network.rpcAddress, result);

				// Get updated contract scripthash
				const scriptHash = experimental.getContractHash(
					u.HexString.fromHex(wallet.getScriptHashFromAddress(account.address)),
					sc.NEF.fromBuffer(contractBytecode).checksum,
					contractManifest.name,
				);
				// Set it to show it
				setUpdatedContract(scriptHash);
			} else {
				if (!address || !connected) {
					message.error('You need to connect a wallet to execute a write invocation');
					return;
				}

				const result = await invoke({
					scriptHash: values.scriptHash,
					operation: 'update',
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
							scope: WitnessScope.CalledByEntry,
						},
					],
				});

				if (result.data?.txId) {
					await waitTx(settingsStore.network.rpcAddress, result.data?.txId);

					// Get updated contract scripthash
					const scriptHash = experimental.getContractHash(
						u.HexString.fromHex(wallet.getScriptHashFromAddress(address)),
						sc.NEF.fromBuffer(contractBytecode).checksum,
						contractManifest.name,
					);
					// Set it to show it
					setUpdatedContract(scriptHash);
				} else {
					message.warning('Contract was not updated due to some problems');
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
			<div className={'m-contract-update-panel'}>
				{updatedContract === null ? (
					<Form form={form} layout={'vertical'} onFinish={onFinish} style={{ height: '100%' }}>
						<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
							<Typography.Title level={4}>{'Update'}</Typography.Title>

							<div style={{ marginTop: 16 }}>
								<Form.Item name={'scriptHash'} label={'ScriptHash'} rules={[{ required: true }]}>
									<Input />
								</Form.Item>
							</div>

							<div>
								<Form.Item
									name={'nefFile'}
									label={'Contract NEF'}
									valuePropName={'nefFile'}
									getValueFromEvent={normalizeFile}
									rules={[{ required: true }]}
								>
									<Upload
										name={'nefFile'}
										accept={'.nef'}
										showUploadList={true}
										customRequest={autoRequest}
										maxCount={1}
									>
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
									<Upload
										name={'manifestFile'}
										accept={'.json'}
										showUploadList={true}
										customRequest={autoRequest}
										maxCount={1}
									>
										<Button type={'default'}>Import Manifest</Button>
									</Upload>
								</Form.Item>
							</div>

							<div style={{ flex: 1 }}></div>

							<div>
								<Form.Item style={{ marginBottom: 0 }}>
									<Button htmlType={'submit'} type={'primary'} size={'large'} block={true}>
										{'Update'}
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
							title={'Contract succesfully updated'}
							subTitle={'Contract scripthash: 0x' + updatedContract}
							extra={[
								<Button type={'primary'} key={'ok'} onClick={() => setUpdatedContract(null)}>
									{'Ok'}
								</Button>,
							]}
						/>
					</div>
				)}
			</div>

			<style jsx>{`
				.m-contract-update-panel {
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
