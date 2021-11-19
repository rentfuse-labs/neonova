import { useMemo } from 'react';
import { useRouter } from 'next/router';

export function useMenuNavigation() {
	const router = useRouter();

	// Get current selected key as the initial part of the route for correct menu highlighting
	return useMemo(() => {
		if (router.pathname) {
			const splittedPathname = router.pathname.split('/');

			if (splittedPathname.length > 0) {
				// I take only the first part that is the initial part of the route i need
				return ['/' + splittedPathname[1]];
			} else {
				return [router.pathname];
			}
		}

		// Default to first route
		return ['/'];
	}, [router]);
}
