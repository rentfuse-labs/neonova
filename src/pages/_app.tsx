import { CodeOutlined, ExportOutlined, FormOutlined, ImportOutlined, MehOutlined } from '@ant-design/icons';
import { Application } from '@application';
import { WalletModalProvider } from '@rentfuse-labs/neo-wallet-adapter-ant-design';
import { WalletProvider } from '@rentfuse-labs/neo-wallet-adapter-react';
import { applySnapshot, onSnapshot } from 'mobx-state-tree';
import {
	getNeoLineWallet,
	getNeonWalletConnectWallet,
	getO3Wallet,
	Wallet,
} from '@rentfuse-labs/neo-wallet-adapter-wallets';
import { createRootStore, persist, RootStoreProvider, SettingsNetworkType, useRootStore } from '@stores';
import { observer } from 'mobx-react-lite';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useEffect, useMemo, useState } from 'react';
import { LocalWalletProvider } from 'src/wallet';
import { useResponsive } from '@hooks';
import { Button, message, Result, Upload } from 'antd';

// Use require instead of import, and order matters
require('@styles/global.css');
require('@rentfuse-labs/neo-wallet-adapter-ant-design/styles.css');

// Return available wallets depending on network type
function getWallets(networkType: SettingsNetworkType) {
	let neonNetworkMap = {
		MainNet: 'neo3:mainnet',
		TestNet: 'neo3:testnet',
		Custom: 'neo3:private',
	};

	if (networkType === 'TestNet' || networkType === 'MainNet' || networkType === 'Custom') {
		return [
			getNeoLineWallet(),
			getO3Wallet(),
			getNeonWalletConnectWallet({
				options: {
					projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, // the ID of your project on Wallet Connect website
					relayUrl: 'wss://relay.walletconnect.com', // we are using walletconnect's official relay server
					metadata: {
						name: 'Neonova',
						description: 'Like Postman but for NEO N3.',
						url: 'https://neonova.space',
						icons: ['https://raw.githubusercontent.com/rentfuse-labs/neonova/main/neonova-icon.png'],
					},
				},
				network: neonNetworkMap[networkType] as any,
			}),
		];
	}
	return [];
}

// Changes available wallets depending on network type
const GlobalWalletProvider = observer(function GlobalWalletProvider({ children }: { children: React.ReactNode }) {
	const { settingsStore } = useRootStore();

	// The Neo N3 wallets i can connect to
	const [wallets, setWallets] = useState<Wallet[]>([]);
	// When network types changes update wallets
	useEffect(() => {
		setWallets(getWallets(settingsStore.network.type));
	}, [settingsStore.network.type]);

	return (
		<>
			<WalletProvider wallets={wallets} autoConnect={false}>
				<WalletModalProvider centered={false}>
					<LocalWalletProvider>{children}</LocalWalletProvider>
				</WalletModalProvider>
			</WalletProvider>

			<style jsx>{``}</style>
		</>
	);
});

export default function _App({ Component, pageProps }: AppProps) {
	const { isTabletAndBelow } = useResponsive();

	// Create the store in this way to apply persistence
	const store = useMemo(() => {
		return createRootStore();
	}, []);
	// Apply persistence to the store
	useEffect(() => {
		if (typeof window !== 'undefined') {
			persist({
				store,
				onGetData: () => {
					const data = localStorage.getItem('@rentfuse-labs/neonova-1.1.0');
					if (data) {
						// To remove loading indicator if it was present when saved snapshot
						const dataJson = JSON.parse(data);
						return { ...dataJson, viewStore: { ...dataJson.viewStore, loadingVisible: false } };
					}
					return null;
				},
				onSaveData: (data) => {
					localStorage.setItem('@rentfuse-labs/neonova-1.1.0', JSON.stringify(data));
				},
			});
		}
	}, [store]);

	// The pages of the application to handle routing and title displaying
	const pages = useMemo(() => {
		return [
			{
				url: '/',
				title: 'Invocations',
				icon: <CodeOutlined />,
				extra: (
					<div style={{ display: 'flex', flexDirection: 'row' }}>
						<div style={{ marginRight: 16 }}>
							<Upload
								name={'file'}
								accept={'.json'}
								customRequest={(request: any) => {
									setTimeout(() => {
										request.onSuccess('ok');
									}, 0);
								}}
								showUploadList={false}
								onChange={async (info) => {
									if (info.file.status === 'done') {
										let dataJson: any = await new Promise((resolve) => {
											const reader = new FileReader();
											reader.addEventListener('load', () => resolve(JSON.parse(reader.result as string)));
											reader.readAsText(info.file.originFileObj as any);
										});
										if (dataJson) {
											console.log(dataJson);
											try {
												applySnapshot(store, {
													...dataJson,
													viewStore: { ...dataJson.viewStore, loadingVisible: false },
												});
											} catch (error) {
												message.error('Import error');
												console.error(error);
											}
										}
									}
								}}
								maxCount={1}
							>
								<Button style={{ background: '#ffffff' }} icon={<ImportOutlined />}>
									{'Import'}
								</Button>
							</Upload>
						</div>

						<div style={{}}>
							<Button
								onClick={() => {
									const a = document.createElement('a');
									const file = new Blob(
										[
											JSON.stringify({
												projectStore: store.projectStore,
												viewStore: store.viewStore,
												settingsStore: store.settingsStore,
											}),
										],
										{ type: 'text/plain' },
									);
									a.href = URL.createObjectURL(file);
									a.download = Date.now() + '.neonova.json';
									a.click();
								}}
								icon={<ExportOutlined />}
								style={{ background: '#ffffff' }}
							>
								{'Export'}
							</Button>
						</div>
					</div>
				),
			},
			{ url: '/contract', title: 'Contracts', icon: <FormOutlined /> },
		];
	}, [store]);

	// If is not desktop it's not supported!
	if (isTabletAndBelow) {
		return (
			<div
				style={{
					width: '100%',
					minHeight: '100vh',
					background: '#ffffff',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Head>
					<link rel="shortcut icon" href="favicon/favicon.ico" />
					<title>Neonova</title>
					<meta name="description" content="Like Postman but for NEO N3." />
				</Head>

				<Result
					icon={<MehOutlined style={{ color: '#00e599' }} />}
					title={"Ops, that's embarassing"}
					subTitle={'Neonova supports only desktop resolution'}
				/>
			</div>
		);
	}

	// Note that we don't recommend ever replacing the value of a Provider with a different one
	// Using MobX, there should be no need for that, since the observable that is shared can be updated itself
	return (
		<RootStoreProvider value={store}>
			<GlobalWalletProvider>
				<Application pages={pages}>
					<Head>
						<link rel="shortcut icon" href="favicon/favicon.ico" />
						<title>Neonova</title>
						<meta name="description" content="Like Postman but for NEO N3." />
					</Head>

					<Component {...pageProps} />
				</Application>
			</GlobalWalletProvider>
		</RootStoreProvider>
	);
}
