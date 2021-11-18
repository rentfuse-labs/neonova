import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const ApplicationLogo = React.memo(function ApplicationLogo({}: {}) {
	return (
		<>
			<Link href={'/'}>
				<a className={'g-link-no-border'}>
					<Image
						src="/assets/neonova-icon_green.svg"
						layout="responsive"
						width={100}
						height={100}
						alt={'Neonova icon'}
					/>
				</a>
			</Link>

			<style jsx>{``}</style>
		</>
	);
});
