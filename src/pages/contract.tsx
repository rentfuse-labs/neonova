import Head from 'next/head';
import React from 'react';
import { ApplicationPage } from '@application';

export default function ContractPage() {
	return (
		<>
			<Head>
				<title>Neonova | Contract</title>
			</Head>

			<ApplicationPage>
				test
				<style jsx>{``}</style>
			</ApplicationPage>
		</>
	);
}
