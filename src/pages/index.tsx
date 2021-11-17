import { Layout } from 'antd';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';

export default function IndexPage() {
	return (
		<div>
			<Head>
				<link rel="shortcut icon" href="favicon/favicon.ico" />
				<title>Neonova</title>
				<meta name="description" content="Like Postman but for NEO N3." />
			</Head>

			<Layout style={{ width: '100%', minHeight: '100vh' }}></Layout>

			<style jsx>{``}</style>
		</div>
	);
}
