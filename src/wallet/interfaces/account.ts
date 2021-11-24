export interface Account {
	WIF: string;
	privateKey: string;
	publicKey: string;
	scriptHash: string;
	address: string;

	getPublicKey(encoded: boolean): string;
	encrypt(keyphrase: string, scryptParams?: any): Promise<this>;
	decrypt(keyphrase: string, scryptParams?: any): Promise<this>;
}