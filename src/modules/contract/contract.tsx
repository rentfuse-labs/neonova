import { useRootStore } from '@stores';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const Contract = observer(function Contract() {
	const { viewStore, invocationStore } = useRootStore();

	return (
		<>
			<div></div>

			<style jsx>{``}</style>
		</>
	);
});
