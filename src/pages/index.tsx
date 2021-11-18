import Head from 'next/head';
import React from 'react';
import { ApplicationPage } from '../application';

export default function IndexPage() {
	return (
		<>
			<Head>
				<title>Neonova</title>
			</Head>

			<ApplicationPage>
				<div>content</div>

				<style jsx>{``}</style>
			</ApplicationPage>
		</>
	);
}
