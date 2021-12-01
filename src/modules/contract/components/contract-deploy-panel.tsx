import { useRootStore } from '@stores';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { deployContract } from '@cityofzion/neon-js/lib/experimental';
import { Button, Form, Input } from 'antd';
import { NETWORK_DATA_MAP } from '../../../constants';

export const ContractDeployPanel = observer(function ContractDeployPanel() {
	const { viewStore, settingsStore, invocationStore } = useRootStore();

	const [form] = Form.useForm();

	const onFinish = (values:any) => {};

	return (
		<>
			<div className={'m-contract-deploy-panel'}>
				<Form
					form={form}
					initialValues={{
						scriptHash: NETWORK_DATA_MAP[settingsStore.network.type].nativeContracts['contractManagement'],
					}}
					layout={'vertical'}
					onFinish={onFinish}
					style={{ height: '100%' }}
				>
					<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
						<div>
							<Form.Item name={'scriptHash'} label={'ScriptHash'} rules={[{ required: true }]}>
								<Input />
							</Form.Item>
						</div>

						<div  style={{ flex: 1 }}>
						
						</div>

						<div>
							<Form.Item style={{ marginBottom: 0 }}>
								<Button htmlType={'submit'} type={'primary'} size={'large'} block={true}>
									{'Deploy'}
								</Button>
							</Form.Item>
						</div>
					</div>
				</Form>
			</div>

			<style jsx>{`
				.m-contract-deploy-panel {
					width: 100%;
					height: 100%;
					background: red;
				}
			`}</style>
		</>
	);
});
