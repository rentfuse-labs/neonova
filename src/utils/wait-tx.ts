import { rpc } from '@cityofzion/neon-js';
import { sleep } from './sleep';

// Returns eventdata if found executed, false if executed with error and throws if txid not found
export async function waitTx(
	rpcAddress: string,
	txId: string,
	scriptHash: string,
	eventName: string,
	readFrequency = 1000,
	timeout = 30000,
) {
	const start = Date.now();
	const rpcClient = new rpc.RPCClient(rpcAddress);

	let applicationLog;
	do {
		// Throw an error if the timeout has passed
		if (Date.now() - start > timeout) throw new Error();

		try {
			applicationLog = await rpcClient.getApplicationLog(txId);
		} catch (e) {
			// Hehe :)
		}
		await sleep(readFrequency);
	} while (!applicationLog);

	// The result of executions
	const result = applicationLog?.executions
		?.reduce((result, current) => result.concat(current.notifications), [] as any)
		?.find((n: any) => n.contract === scriptHash && n.eventname === eventName);

	if (result) {
		// Parse result and return it as array, otherwise empty
		return result.state.value;
	}
	return null;
}
