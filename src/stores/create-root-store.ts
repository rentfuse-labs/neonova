import { RootStore, RootStoreModel } from './root-store';

export const createRootStore = (): RootStore => {
	return RootStoreModel.create({
		viewStore: {
			selectedInvocationId: '',
		},
		settingsStore: {
			network: {
				type: 'TestNet',
				rpcUrl: '',
			},
		},
		invocationStore: {
			invocations: [],
		},
	});
};
