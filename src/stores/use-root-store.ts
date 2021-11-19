import { useContext } from 'react';
import { RootStoreContext } from './root-store-context';

export function useRootStore() {
	const store = useContext(RootStoreContext);
	if (store === null) {
		throw new Error('Store cannot be null, please add a context provider');
	}
	return store;
}
