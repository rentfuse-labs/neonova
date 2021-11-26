import { NETWORK_DATA_MAP } from '@constants';
import { RootStore, RootStoreModel } from './root-store';

export const createRootStore = (): RootStore => {
	return RootStoreModel.create({
		viewStore: {
			loadingVisible: false,
			selectedInvocationId: '',
		},
		settingsStore: {
			network: {
				type: 'TestNet',
				rpcAddress: '',
				networkMagic: NETWORK_DATA_MAP['TestNet'].networkMagic,
			},
		},
		invocationStore: {
			invocations: [],
		},
	});
};
