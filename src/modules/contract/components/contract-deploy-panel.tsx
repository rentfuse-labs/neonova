import { sc, u, wallet } from '@cityofzion/neon-js';
import { deployContract } from '@cityofzion/neon-js/lib/experimental';
import { waitTx, WitnessScope } from '@rentfuse-labs/neo-wallet-adapter-base';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { useRootStore } from '@stores';
import { useLocalWallet } from '@wallet';
import { Button, Form, message, Typography, Upload } from 'antd';
import { Buffer } from 'buffer';
import { observer } from 'mobx-react-lite';
import { toInvocationArgument } from '@utils';
import React from 'react';
import { NETWORK_DATA_MAP } from '@constants';

export const ContractDeployPanel = observer(function ContractDeployPanel() {
	const { viewStore, settingsStore } = useRootStore();

	const { address, connected, invoke } = useWallet();
	const { account } = useLocalWallet();

	const [form] = Form.useForm();

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
					reader.readAsText(values.nefFile.originFileObj);
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
				const result = await deployContract(sc.NEF.fromBuffer(contractBytecode), contractManifest, {
					networkMagic: settingsStore.network.networkMagic,
					rpcAddress: settingsStore.network.rpcAddress,
					account: account as any,
				});
				console.log('Contract deployed!');
				console.log(result);

				//await waitTx(settingsStore.network.rpcAddress, result);
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

				// TOREMOVE
				console.log(result);

				if (result.data?.txId) {
					await waitTx(settingsStore.network.rpcAddress, result.data?.txId);
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
				<Form form={form} layout={'vertical'} onFinish={onFinish} style={{ height: '100%' }}>
					<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
						<Typography.Title level={4}>{'Deploy'}</Typography.Title>

						<div>
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
								<Upload name={'manifestFile'} accept={'.manifest.json'} showUploadList={true} maxCount={1}>
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
			</div>

			<style jsx>{`
				.m-contract-deploy-panel {
					width: 100%;
					height: 100%;
					padding: 16px;
				}
			`}</style>
		</>
	);
});
