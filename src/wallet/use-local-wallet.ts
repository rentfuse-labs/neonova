import React from 'react';
import { useContext } from 'react';
import { Account } from './interfaces';

export interface LocalWalletProviderState {
	account: Account | null;
	setAccount: (account: Account | null) => void;
}

export const LocalWalletContext = React.createContext<LocalWalletProviderState>({} as LocalWalletProviderState);

export function useLocalWallet() {
	return useContext(LocalWalletContext);
}
