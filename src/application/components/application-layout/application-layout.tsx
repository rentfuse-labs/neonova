import React from 'react';
import { Layout } from 'antd';

export const ApplicationLayout = React.memo(function ApplicationLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Layout className={'a-layout'}>
				{children}

				<style jsx>{`
					:global(.a-layout) {
						width: 100%;
						min-height: 100vh;
					}
				`}</style>
			</Layout>
		</>
	);
});
