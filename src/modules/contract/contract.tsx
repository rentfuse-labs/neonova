import { Col, Row } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ContractDeployPanel, ContractUpdatePanel } from './components';

export const Contract = observer(function Contract() {
	return (
		<>
			<div className={'m-contract'}>
				<Row gutter={[16, 16]} style={{ height: '100%' }}>
					<Col span={12} style={{ height: '100%' }}>
						<ContractDeployPanel />
					</Col>

					<Col span={12} style={{ height: '100%' }}>
						<ContractUpdatePanel />
					</Col>
				</Row>
			</div>

			<style jsx>{`
				.m-contract {
					width: 100%;
					height: 100%;
				}
			`}</style>
		</>
	);
});
