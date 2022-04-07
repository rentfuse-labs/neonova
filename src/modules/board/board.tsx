import { getDefaultInvocation, Invocation, Project, useRootStore } from '@stores';
import { Form, Input, Menu, Tabs } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { BoardItem } from './components';

export const Board = observer(function Board() {
	const { viewStore, projectStore } = useRootStore();

	const selectedProject = projectStore.getProject(viewStore.selectedProjectId);

	const onChangeTabs = (selectedKey: string) => {
		viewStore.setSelectedInvocationId(selectedKey);
	};

	const onEditTabs = (targetKey: any, action: string) => {
		switch (action) {
			case 'add':
				if (selectedProject) {
					const invocationToAdd = getDefaultInvocation() as Invocation;
					const projectToUpdate = {
						...selectedProject,
						invocations: selectedProject.invocations.concat(invocationToAdd),
					} as Project;
					projectStore.updateProject(projectToUpdate);
					viewStore.setSelectedInvocationId(invocationToAdd.id);
				}
				break;
			case 'remove':
				if (selectedProject) {
					const projectToUpdate = {
						...selectedProject,
						invocations: selectedProject.invocations.filter(
							(_invocation) => _invocation.id !== targetKey,
						) as Invocation[],
					} as Project;
					// If i'm removing last one prompt with a new blank starter to avoid having all empty
					if (!projectToUpdate.invocations.length) {
						projectToUpdate.invocations.push(getDefaultInvocation());
					}

					// Update project
					projectStore.updateProject(projectToUpdate);

					// Calculate the new selected key after removing this one
					let newSelectedKey = viewStore.selectedInvocationId || selectedProject.invocations[0].id;
					if (newSelectedKey === targetKey) {
						const targetIndex = projectToUpdate.invocations.findIndex((invocation) => invocation.id === targetKey);
						if (targetIndex - 1 >= 0) {
							newSelectedKey = selectedProject.invocations[targetIndex - 1].id;
						} else {
							newSelectedKey = selectedProject.invocations[0].id;
						}
					}
					// Set the new selected key
					viewStore.setSelectedInvocationId(newSelectedKey);
				}
				break;
		}
	};

	const onSelectMenuItem = ({ key }: { key: any }) => {
		viewStore.setSelectedProjectId(key);
	};

	return (
		<>
			<div className={'m-board'}>
				<Menu
					selectedKeys={[viewStore.selectedProjectId]}
					mode={'vertical'}
					onSelect={onSelectMenuItem}
					className={'m-board-menu'}
				>
					{projectStore.projects.map((project) => (
						<Menu.Item key={project.id} style={{ marginTop: 0, marginBottom: 8, paddingTop: 2 }}>
							{
								<Form
									name="basic"
									initialValues={{ name: project.name }}
									onValuesChange={(_, values) => {
										const projectToUpdate = { ...project, name: values.name };
										projectStore.updateProject(projectToUpdate);
									}}
								>
									<Form.Item name={'name'} rules={[{ required: true, message: '' }]}>
										<Input bordered={false} />
									</Form.Item>
								</Form>
							}
						</Menu.Item>
					))}
				</Menu>

				<Tabs
					type={'editable-card'}
					activeKey={viewStore.selectedInvocationId}
					onChange={onChangeTabs}
					onEdit={onEditTabs}
					className={'m-board-tabs'}
				>
					{selectedProject?.invocations.map((_invocation) => (
						<Tabs.TabPane tab={_invocation.operation || 'New'} key={_invocation.id} closable={true}>
							<BoardItem project={selectedProject} invocation={_invocation} />
						</Tabs.TabPane>
					))}
				</Tabs>
			</div>

			<style jsx>{`
				:global(.m-board) {
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: row;
				}

				:global(.m-board-menu) {
					width: 256px;
					border-radius: 4px;
				}

				:global(.m-board-tabs) {
					flex: 1;
					margin-left: 16px;
					height: 100%;
				}

				:global(.m-board-tabs .ant-tabs-nav) {
					margin-bottom: 0px;
				}

				:global(.m-board-tabs .ant-tabs-content-holder) {
					height: 100%;
					padding: 16px;
					border-left: 1px solid #eceff1;
					border-right: 1px solid #eceff1;
					border-bottom: 1px solid #eceff1;
					border-radius: 0px 0px 4px 4px;
					background: #ffffff;
				}

				:global(.m-board-tabs .ant-tabs-content) {
					height: 100%;
				}
			`}</style>
		</>
	);
});
