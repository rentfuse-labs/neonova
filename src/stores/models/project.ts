import cuid from 'cuid';
import { Instance, types } from 'mobx-state-tree';
import { getDefaultInvocation, Invocation, InvocationModel } from './invocation';

export type Project = Instance<typeof ProjectModel>;
export type ProjectStore = Instance<typeof ProjectStoreModel>;

export const ProjectModel = types
	.model('ProjectModel', {
		id: types.identifier,
		name: types.string,
		invocations: types.array(InvocationModel),
	})
	.actions((self) => ({}));

// With multiple actions chained for typechecking
export const ProjectStoreModel = types
	.model('ProjectStoreModel', {
		projects: types.array(ProjectModel),
	})
	.views((self) => ({}))
	.actions((self) => ({
		getProject(id: string) {
			return self.projects.find((project) => project.id === id);
		},
		addProject(project: Project) {
			self.projects.push(project);
		},
		removeProject(id: string) {
			const index = self.projects.findIndex((project) => project.id === id);
			if (index !== -1) {
				self.projects.splice(index, 1);
			}
		},
		updateProject(project: Project) {
			const index = self.projects.findIndex((_project) => _project.id === project.id);
			if (index !== -1) {
				self.projects[index] = project;
			}
		},
		updateInvocation(project: Project, invocation: Invocation) {
			const projectIndex = self.projects.findIndex((_project) => _project.id === project.id);
			if (projectIndex !== -1) {
				const projectToUpdate = { ...project };
				const invocationIndex = projectToUpdate.invocations.findIndex(
					(_invocation) => _invocation.id === invocation.id,
				);
				if (invocationIndex !== -1) {
					projectToUpdate.invocations[invocationIndex] = invocation;
					self.projects[projectIndex] = projectToUpdate;
				}
			}
		},
	}));

export function getDefaultProject() {
	return {
		id: cuid(),
		name: 'Default',
		invocations: [getDefaultInvocation()],
	};
}
