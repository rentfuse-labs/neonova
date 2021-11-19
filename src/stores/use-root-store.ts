import { useContext } from 'react';
import { RootStoreContext } from './root-store-context';

export function useRootStore() {
	return useContext(RootStoreContext);
}
