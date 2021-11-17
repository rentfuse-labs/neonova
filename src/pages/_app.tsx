import React from 'react';
import { AppProps } from 'next/app';

// Global css to be applied to the whole app
import './../styles/global.css';

export default function _App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
