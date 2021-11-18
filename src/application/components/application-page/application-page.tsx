import React from 'react';

export const ApplicationPage = React.memo(function ApplicationPage({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className={'a-page'}>{children}</div>

			<style jsx>{`
				.a-page {
					width: 100%;
					height: 100%;
					padding: 16px;
				}
			`}</style>
		</>
	);
});
