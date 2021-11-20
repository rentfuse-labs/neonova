import { Instance, types } from 'mobx-state-tree';

export type ViewStore = Instance<typeof ViewStoreModel>;

export const ViewStoreModel = types
	.model('ViewStoreModel', {
		selectedInvocationId: types.optional(types.string, ''),
	})
	.views((self) => ({}))
	.actions((self) => ({
		setSelectedInvocationId(id: string) {
			self.selectedInvocationId = id;
		},
	}));
