import React from 'react';
import { RootStore } from './root-store';
import { RootStoreContext } from './root-store-context';

export const RootStoreProvider = React.memo(function RootStoreProvider({
	value,
	children,
}: {
	value: RootStore;
	children: React.ReactNode;
}) {
	return <RootStoreContext.Provider value={value}>{children}</RootStoreContext.Provider>;
});
