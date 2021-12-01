import Head from 'next/head';
import React from 'react';
import { ApplicationPage } from '@application';
import { Contract } from '@modules/contract';

export default function ContractPage() {
	return (
		<>
			<Head>
				<title>Neonova | Contract</title>
			</Head>

			<ApplicationPage>
				<Contract />

				<style jsx>{``}</style>
			</ApplicationPage>
		</>
	);
}
