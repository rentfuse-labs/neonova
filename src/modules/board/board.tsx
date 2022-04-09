import {
	CloseCircleOutlined,
	CloseOutlined,
	ExclamationCircleOutlined,
	PlusCircleOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { getDefaultInvocation, getDefaultProject, Invocation, Project, useRootStore } from '@stores';
import { Button, Input, List, Modal, Tabs } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import useDimensions from 'react-cool-dimensions';
import { BoardItem } from './components';

export const Board = observer(function Board() {
	const { observe: boardRef, height: boardHeight } = useDimensions<HTMLDivElement>();
	const { viewStore, projectStore } = useRootStore();

	const selectedProject = projectStore.getProject(viewStore.selectedProjectId);

	const onAddProject = () => {
		const projectToAdd = getDefaultProject() as any;
		projectStore.addProject(projectToAdd);
		viewStore.setSelectedProjectId(projectToAdd.id);
		viewStore.setSelectedInvocationId(projectToAdd.invocations[0].id);
	};

	const onRemoveProject = (project: Project) => {
		Modal.confirm({
			title: 'Delete group ' + project.name,
			icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
			onOk() {
				// Remove project
				projectStore.removeProject(project.id);

				// If after removed there are still other projects find best key to highlight
				if (projectStore.projects.length) {
					// Calculate the new selected key after removing this one
					let newSelectedKey = viewStore.selectedProjectId || projectStore.projects[0].id;
					if (newSelectedKey === project.id) {
						const targetIndex = projectStore.projects.findIndex((_project) => _project.id === project.id);
						if (targetIndex - 1 >= 0) {
							newSelectedKey = projectStore.projects[targetIndex - 1].id;
						} else {
							newSelectedKey = projectStore.projects[0].id;
						}
					}
					// Set the new selected key
					viewStore.setSelectedProjectId(newSelectedKey);
					viewStore.setSelectedInvocationId(projectStore.getProject(newSelectedKey)!.invocations[0].id);
				} else {
					onAddProject();
				}
			},
			okText: 'Delete',
			okType: 'danger',
		});
	};

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

	const onSelectMenuItem = (id: string) => {
		viewStore.setSelectedProjectId(id);
		viewStore.setSelectedInvocationId(projectStore.getProject(id)!.invocations[0].id);
	};

	return (
		<>
			<div ref={boardRef} className={'m-board'}>
				<List
					footer={
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								marginLeft: 16,
								marginRight: 16,
							}}
						>
							<Button onClick={onAddProject} icon={<PlusOutlined />} block={true}>
								{'Add'}
							</Button>
						</div>
					}
					itemLayout={'vertical'}
					dataSource={projectStore.projects}
					renderItem={(project: Project) => (
						<List.Item
							key={project.id}
							onClick={() => onSelectMenuItem(project.id)}
							className={'m-board-menu-item'}
							style={{ background: project.id === viewStore.selectedProjectId ? '#00e599' : '#ffffff' }}
						>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Input
									defaultValue={project.name}
									onChange={(e) => {
										const projectToUpdate = { ...project, name: e.target.value };
										projectStore.updateProject(projectToUpdate);
									}}
									bordered={project.id === viewStore.selectedProjectId}
								/>

								<div style={{ marginLeft: 16 }}>
									{project.id === viewStore.selectedProjectId && (
										<CloseOutlined onClick={() => onRemoveProject(project)} />
									)}
								</div>
							</div>
						</List.Item>
					)}
					className={'m-board-menu'}
					style={{ height: boardHeight }}
				/>

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
					background: #ffffff;
					border-radius: 4px;
					overflow: auto;
				}

				:global(.m-board-menu-item) {
					cursor: pointer;
					padding: 16px;
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
