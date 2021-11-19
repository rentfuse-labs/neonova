import { Tabs } from 'antd';
import cuid from 'cuid';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';

export interface Pane {
	title: string;
	content: React.ReactNode;
	key: string;
	closable: boolean;
}

export interface BoardState {
	activeKey?: string;
	panes: Pane[];
}

const INITIAL_PANES: Pane[] = [
	{ title: 'Starter tab', content: 'Content of starter tab', key: cuid(), closable: true },
];

const INITIAL_BOARD_STATE: BoardState = {
	activeKey: INITIAL_PANES[0].key,
	panes: INITIAL_PANES,
};

export const Board = observer(function Board() {
	const [boardState, setBoardState] = useState<BoardState>(INITIAL_BOARD_STATE);

	const onChange = useCallback((activeKey) => {
		setBoardState((_boardState) => ({ ..._boardState, activeKey }));
	}, []);

	const onEdit = useCallback((targetKey, action) => {
		switch (action) {
			case 'add':
				setBoardState((_boardState) => {
					const newKey = cuid();
					return {
						activeKey: newKey,
						panes: [
							..._boardState.panes,
							{ title: 'New Tab', content: 'Content of new Tab', key: newKey, closable: true },
						],
					};
				});
				break;
			case 'remove':
				setBoardState((_boardState) => {
					// If i'm removing last one prompr with a new blank starter to avoid having all empty
					if (_boardState.panes.length === 1) {
						return INITIAL_BOARD_STATE;
					}

					let newActiveKey = _boardState.activeKey;
					let lastIndex = -1;
					_boardState.panes.forEach((pane, i) => {
						if (pane.key === targetKey) {
							lastIndex = i - 1;
						}
					});

					const newPanes = _boardState.panes.filter((_pane) => _pane.key !== targetKey);
					if (newPanes.length && newActiveKey === targetKey) {
						if (lastIndex >= 0) {
							newActiveKey = newPanes[lastIndex].key;
						} else {
							newActiveKey = newPanes[0].key;
						}
					}
					return {
						activeKey: newActiveKey,
						panes: newPanes,
					};
				});
				break;
		}
	}, []);

	return (
		<>
			<Tabs
				type={'editable-card'}
				onChange={onChange}
				activeKey={boardState.activeKey}
				onEdit={onEdit}
				className={'m-tabs-container'}
			>
				{boardState.panes.map((_pane) => (
					<Tabs.TabPane tab={_pane.title} key={_pane.key} closable={_pane.closable}>
						{_pane.content}
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
