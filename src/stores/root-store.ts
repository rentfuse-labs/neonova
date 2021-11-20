import { Instance, types } from 'mobx-state-tree';
import { ViewStoreModel, InvocationStoreModel } from './models';

export type RootStore = Instance<typeof RootStoreModel>;

export const RootStoreModel = types
	.model('RootStoreModel', {
		viewStore: ViewStoreModel,
		invocationStore: InvocationStoreModel,
	})
	.actions((self) => ({
		afterCreate() {
			self.invocationStore.addDefaultInvocation();
			self.viewStore.setSelectedInvocationId(self.invocationStore.getLastInvocation()!.id);
		},
	}));
