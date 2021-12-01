import { useRootStore } from '@stores';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { deployContract } from '@cityofzion/neon-js/lib/experimental';
import { Col, Row } from 'antd';
import { ContractDeployPanel } from './components/contract-deploy-panel';

export const Contract = observer(function Contract() {
	const { viewStore, invocationStore } = useRootStore();

	return (
		<>
			<div className={'m-contract'}>
				<Row gutter={[16, 16]} style={{ height: '100%' }}>
					<Col span={12} style={{ height: '100%' }}>
						<ContractDeployPanel />
					</Col>

					<Col span={12}></Col>
				</Row>
			</div>

			<style jsx>{`
				.m-contract {
					width: 100%;
					height: 100%;
					background: #ffffff;
					border-radius: 4px;
				}
			`}</style>
		</>
	);
});
