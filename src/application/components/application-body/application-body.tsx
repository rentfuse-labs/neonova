import React from 'react';

export const ApplicationBody = React.memo(function ApplicationBody({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className={'a-body'}>{children}</div>

			<style jsx>{`
				.a-body {
					width: 100%;
					min-height: 100vh;
					background: #eceff1;
				}
			`}</style>
		</>
	);
});
