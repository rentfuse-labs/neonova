import React, { useEffect, useMemo } from 'react';
import Head from 'next/head';
import { getNeoLineWallet, getO3Wallet, getWalletConnectWallet } from '@rentfuse-labs/neo-wallet-adapter-wallets';
import { Application } from '@application';
import { RootStoreProvider, createRootStore, persist } from '@stores';
import { AppProps } from 'next/app';
import { WalletProvider } from '@rentfuse-labs/neo-wallet-adapter-react';
import { WalletModalProvider } from '@rentfuse-labs/neo-wallet-adapter-ant-design';
import { AppstoreOutlined } from '@ant-design/icons';
import { LocalWalletProvider } from 'src/wallet';

// Use require instead of import, and order matters
require('@styles/global.css');
require('@rentfuse-labs/neo-wallet-adapter-ant-design/styles.css');

export default function _App({ Component, pageProps }: AppProps) {
	// The pages of the application to handle routing and title displaying
	const pages = useMemo(() => {
		return [{ url: '/', title: 'Invocations', icon: <AppstoreOutlined /> }];
	}, []);

	// The Neo N3 wallets i can connect to
	const wallets = useMemo(() => {
		return [
			getNeoLineWallet(),
			getO3Wallet(),
			getWalletConnectWallet({
				options: {
					chainId: 'neo3:testnet',
					methods: ['invokefunction'],
					appMetadata: {
						name: 'MyApplicationName', // your application name to be displayed on the wallet
						description: 'My Application description', // description to be shown on the wallet
						url: 'https://myapplicationdescription.app/', // url to be linked on the wallet
						icons: ['https://myapplicationdescription.app/myappicon.png'], // icon to be shown on the wallet
					},
				},
				logger: 'debug',
				relayProvider: 'wss://relay.walletconnect.org',
			}),
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
					return localStorage.getItem('@rentfuse-labs/neonova');
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
			<WalletProvider wallets={wallets} autoConnect={false}>
				<WalletModalProvider centered={false}>
					<LocalWalletProvider>
						<Application pages={pages}>
							<Head>
								<link rel="shortcut icon" href="favicon/favicon.ico" />
								<title>Neonova</title>
								<meta name="description" content="Like Postman but for NEO N3." />
							</Head>

							<Component {...pageProps} />
						</Application>
					</LocalWalletProvider>
				</WalletModalProvider>
			</WalletProvider>
		</RootStoreProvider>
	);
}
