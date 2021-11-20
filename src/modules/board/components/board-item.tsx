import { useRootStore } from '@stores';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Invocation } from '../../../stores/models';

export const BoardItem = observer(function BoardItem({ invocation }: { invocation: Invocation }) {
	const { invocationStore } = useRootStore();

	return (
		<>
			<div>{invocation.id}</div>

			<style jsx>{``}</style>
		</>
	);
});
