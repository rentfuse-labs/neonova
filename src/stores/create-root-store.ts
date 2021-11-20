import { RootStore, RootStoreModel } from './root-store';

export const createRootStore = (): RootStore => {
	return RootStoreModel.create({
		viewStore: {
			selectedInvocation: '',
		},
		invocationStore: {
			invocations: [],
		},
	});
};
