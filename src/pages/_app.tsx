import React, { useMemo } from 'react';
import Head from 'next/head';
import { getNeoLineWallet, getO3Wallet, getWalletConnectWallet } from '@rentfuse-labs/neo-wallet-adapter-wallets';
import { Application } from '@application';
import { RootStoreProvider, createRootStore } from '@stores';
import { AppProps } from 'next/app';
import { WalletProvider } from '@rentfuse-labs/neo-wallet-adapter-react';
import { WalletModalProvider } from '@rentfuse-labs/neo-wallet-adapter-ant-design';

// Global css import
import '@styles/global.css';

export default function _App({ Component, pageProps }: AppProps) {
	// The wallets that i can connect to
	const wallets = useMemo(
		() => [
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
		],
		[],
	);

	// Note that we don't recommend ever replacing the value of a Provider with a different one
	// Using MobX, there should be no need for that, since the observable that is shared can be updated itself
	return (
		<RootStoreProvider value={createRootStore()}>
			<WalletProvider wallets={wallets} autoConnect={false}>
				<WalletModalProvider>
					<Application>
						<Head>
							<link rel="shortcut icon" href="favicon/favicon.ico" />
							<title>Neonova</title>
							<meta name="description" content="Like Postman but for NEO N3." />
						</Head>

						<Component {...pageProps} />
					</Application>
				</WalletModalProvider>
			</WalletProvider>
		</RootStoreProvider>
	);
}
