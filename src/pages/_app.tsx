import React from 'react';
import Head from 'next/head';
import { Application } from '../application';
import { AppProps } from 'next/app';

// Global css to be applied to the whole app
import './../styles/global.css';

export default function _App({ Component, pageProps }: AppProps) {
	return (
		<Application>
			<Head>
				<link rel="shortcut icon" href="favicon/favicon.ico" />
				<title>Neonova</title>
				<meta name="description" content="Like Postman but for NEO N3." />
			</Head>

			<Component {...pageProps} />
		</Application>
	);
}
