import { Instance, types } from 'mobx-state-tree';
import { ViewStoreModel, ProjectStoreModel, SettingsStoreModel, getDefaultProject } from './models';

export type RootStore = Instance<typeof RootStoreModel>;

export const RootStoreModel = types
	.model('RootStoreModel', {
		viewStore: ViewStoreModel,
		settingsStore: SettingsStoreModel,
		projectStore: ProjectStoreModel,
	})
	.actions((self) => ({
		afterCreate() {
			const projectToAdd = getDefaultProject() as any;
			self.projectStore.addProject(projectToAdd);
			self.viewStore.setSelectedProjectId(projectToAdd.id);
			self.viewStore.setSelectedInvocationId(projectToAdd.invocations[0].id);
		},
	}));
