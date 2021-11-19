import { InvocationStoreModel } from './models';
import { RootStore, RootStoreModel } from './root-store';

export const createRootStore = (): RootStore => {
	return RootStoreModel.create({
		invocationStore: InvocationStoreModel.create(),
	});
};
