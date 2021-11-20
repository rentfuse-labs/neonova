import Head from 'next/head';
import React from 'react';
import { ApplicationPage } from '@application';
import { Board } from '@modules/board';

export default function IndexPage() {
	return (
		<>
			<Head>
				<title>Neonova</title>
			</Head>

			<ApplicationPage>
				<Board />

				<style jsx>{``}</style>
			</ApplicationPage>
		</>
	);
}
