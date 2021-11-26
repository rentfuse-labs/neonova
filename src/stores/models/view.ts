import { Instance, types } from 'mobx-state-tree';

export type ViewStore = Instance<typeof ViewStoreModel>;

export const ViewStoreModel = types
	.model('ViewStoreModel', {
		loadingVisible: types.boolean,
		selectedInvocationId: types.optional(types.string, ''),
	})
	.views((self) => ({}))
	.actions((self) => ({
		setLoadingVisible(visible: boolean) {
			self.loadingVisible = visible;
		},
		setSelectedInvocationId(id: string) {
			self.selectedInvocationId = id;
		},
	}));
