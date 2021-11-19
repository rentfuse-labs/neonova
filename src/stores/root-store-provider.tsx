import React from 'react';
import { createRootStore } from './create-root-store';
import { RootStoreContext } from './root-store-context';

export const RootStoreProvider = React.memo(function RootStoreProvider({ children }: { children: React.ReactNode }) {
	// Note that we don't recommend ever replacing the value of a Provider with a different one
	// Using MobX, there should be no need for that, since the observable that is shared can be updated itself
	return <RootStoreContext.Provider value={createRootStore()}>{children}</RootStoreContext.Provider>;
});
