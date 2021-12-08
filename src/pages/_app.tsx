import { CodeOutlined, FormOutlined } from '@ant-design/icons';
import { Application } from '@application';
import { WalletModalProvider } from '@rentfuse-labs/neo-wallet-adapter-ant-design';
import { WalletProvider } from '@rentfuse-labs/neo-wallet-adapter-react';
import {
	getNeoLineWallet,
	getO3Wallet,
	getWalletConnectWallet,
	Wallet,
} from '@rentfuse-labs/neo-wallet-adapter-wallets';
import { createRootStore, persist, RootStoreProvider, SettingsNetworkType, useRootStore } from '@stores';
import { observer } from 'mobx-react-lite';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useEffect, useMemo, useState } from 'react';
import { LocalWalletProvider } from 'src/wallet';

// Use require instead of import, and order matters
require('@styles/global.css');
require('@rentfuse-labs/neo-wallet-adapter-ant-design/styles.css');

// Return available wallets depending on network type
function getWallets(networkType: SettingsNetworkType) {
	if (networkType === 'TestNet' || networkType === 'MainNet') {
		return [
			getNeoLineWallet(),
			getO3Wallet(),
			getWalletConnectWallet({
				options: {
					chainId: networkType === 'TestNet' ? 'neo3:testnet' : 'neo3:mainnet',
					methods: ['invokefunction'],
					appMetadata: {
						name: 'Neonova',
						description: 'Like Postman but for NEO N3.',
						url: 'https://neonova.space',
						icons: ['https://raw.githubusercontent.com/rentfuse-labs/neonova/main/neonova-icon.png'],
					},
				},
				logger: 'debug',
				relayProvider: 'wss://relay.walletconnect.org',
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
	// The pages of the application to handle routing and title displaying
	const pages = useMemo(() => {
		return [
			{ url: '/', title: 'Invocations', icon: <CodeOutlined /> },
			{ url: '/contract', title: 'Contracts', icon: <FormOutlined /> },
		];
	}, []);

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
					const data = localStorage.getItem('@rentfuse-labs/neonova');
					if (data) {
						// To remove loading indicator if it was present when saved snapshot
						const dataJson = JSON.parse(data);
						return { ...dataJson, viewStore: { ...dataJson.viewStore, loadingVisible: false } };
					}
					return null;
				},
				onSaveData: (data) => {
					localStorage.setItem('@rentfuse-labs/neonova', JSON.stringify(data));
				},
			});
		}
	}, [store]);

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
