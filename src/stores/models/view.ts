import { Instance, types } from 'mobx-state-tree';

export type ViewStore = Instance<typeof ViewStoreModel>;

export const ViewStoreModel = types
	.model('ViewStoreModel', {
		loadingVisible: types.boolean,
		selectedProjectId: types.optional(types.string, ''),
		selectedInvocationId: types.optional(types.string, ''),
	})
	.views((self) => ({}))
	.actions((self) => ({
		setLoadingVisible(visible: boolean) {
			self.loadingVisible = visible;
		},
		setSelectedProjectId(id: string) {
			self.selectedProjectId = id;
		},
		setSelectedInvocationId(id: string) {
			self.selectedInvocationId = id;
		},
	}));
