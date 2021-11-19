import React from 'react';
import Head from 'next/head';
import { Application } from '@application';
import { RootStoreProvider, createRootStore } from '@stores';
import { AppProps } from 'next/app';

// Global css import
import '@styles/global.css';

export default function _App({ Component, pageProps }: AppProps) {
	// Note that we don't recommend ever replacing the value of a Provider with a different one
	// Using MobX, there should be no need for that, since the observable that is shared can be updated itself
	return (
		<RootStoreProvider value={createRootStore()}>
			<Application>
				<Head>
					<link rel="shortcut icon" href="favicon/favicon.ico" />
					<title>Neonova</title>
					<meta name="description" content="Like Postman but for NEO N3." />
				</Head>

				<Component {...pageProps} />
			</Application>
		</RootStoreProvider>
	);
}
