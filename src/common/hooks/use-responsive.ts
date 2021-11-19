import { useMediaQuery } from 'react-responsive';

// Breakpoints taken as for antd design all in px
const BREAKPOINTS = {
	xs: 480,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	xxl: 1600,
};

export function useResponsive() {
	const isDesktop = useMediaQuery({ query: `(min-width: ${BREAKPOINTS['lg']}px)` });
	const isTabletAndBelow = useMediaQuery({ query: `(max-width: ${BREAKPOINTS['lg'] - 1}px)` });
	const isMobileAndBelow = useMediaQuery({ query: `(max-width: ${BREAKPOINTS['sm'] - 1}px)` });

	return { isDesktop, isTabletAndBelow, isMobileAndBelow };
}
