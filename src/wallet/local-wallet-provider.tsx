import React, { useState } from 'react';
import { Account } from './interfaces';
import { LocalWalletContext } from './use-local-wallet';

export const LocalWalletProvider = React.memo(function LocalWalletProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [account, setAccount] = useState<Account | null>(null);

	return <LocalWalletContext.Provider value={{ account, setAccount }}>{children}</LocalWalletContext.Provider>;
});
