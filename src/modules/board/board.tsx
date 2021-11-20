import { useRootStore } from '@stores';
import { Tabs } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const Board = observer(function Board() {
	const { viewStore, invocationStore } = useRootStore();

	const onChange = (selectedKey: string) => {
		viewStore.setSelectedInvocationId(selectedKey);
	};

	const onEdit = (targetKey: any, action: string) => {
		switch (action) {
			case 'add':
				invocationStore.addDefaultInvocation();
				viewStore.setSelectedInvocationId(invocationStore.getLastInvocation()!.id);
				break;
			case 'remove':
				// Save the index of the target invocation
				const targetIndex = invocationStore.invocations.findIndex((_invocation) => _invocation.id === targetKey);

				// Remove the selected invocation
				invocationStore.removeInvocation(invocationStore.getInvocation(targetKey)!.id);
				// If i'm removing last one prompt with a new blank starter to avoid having all empty
				if (!invocationStore.invocations.length) {
					invocationStore.addDefaultInvocation();
				}

				// Calculate the new selected key after removing this one
				let newSelectedKey = viewStore.selectedInvocationId || invocationStore.invocations[0].id;
				if (newSelectedKey === targetKey) {
					if (targetIndex - 1 >= 0) {
						newSelectedKey = invocationStore.invocations[targetIndex - 1].id;
					} else {
						newSelectedKey = invocationStore.invocations[0].id;
					}
				}

				// Set the new selected key
				viewStore.setSelectedInvocationId(newSelectedKey);
				break;
		}
	};

	return (
		<>
			<Tabs
				type={'editable-card'}
				onChange={onChange}
				activeKey={viewStore.selectedInvocationId}
				onEdit={onEdit}
				className={'m-tabs-container'}
			>
				{invocationStore.invocations.map((_invocation) => (
					<Tabs.TabPane tab={_invocation.operation} key={_invocation.id} closable={true}>
						{'The content is a view that updates the selected invocation'}
					</Tabs.TabPane>
				))}
			</Tabs>

			<style jsx>{`
				:global(.m-tabs-container) {
				}

				:global(.m-tabs-container .ant-tabs-nav) {
					margin-bottom: 0px;
				}

				:global(.m-tabs-container .ant-tabs-content-holder) {
					padding: 16px;
					border-left: 1px solid #eceff1;
					border-right: 1px solid #eceff1;
					border-bottom: 1px solid #eceff1;
					border-radius: 0px 0px 4px 4px;
					background: #ffffff;
				}
			`}</style>
		</>
	);
});
