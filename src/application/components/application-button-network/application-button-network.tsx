import { ApiOutlined } from '@ant-design/icons';
import { useRootStore } from '@stores';
import { Button, Form, Input, Modal, Radio } from 'antd';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

export const ApplicationButtonNetwork = observer(function ApplicationButtonNetwork() {
	const { settingsStore } = useRootStore();

	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isRpcUrlVisible, setIsRpcUrlVisible] = useState(false);

	useEffect(
		() =>
			autorun(() => {
				if (settingsStore.network.type === 'LocalNet') {
					setIsRpcUrlVisible(true);
				}
			}),
		[],
	);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		form.submit();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const onFinish = (values: any) => {
		settingsStore.setNetwork({ type: values.type, rpcUrl: values.rpcUrl });
		setIsModalVisible(false);
	};

	const onChange = (event: any) => {
		setIsRpcUrlVisible(event.target.value === 'LocalNet');
	};

	return (
		<>
			<Button icon={<ApiOutlined />} type={'dashed'} onClick={showModal}>
				{settingsStore.network.type}
			</Button>

			<Modal
				title={'Network'}
				visible={isModalVisible}
				okText={'Save'}
				onOk={handleOk}
				onCancel={handleCancel}
				destroyOnClose={true}
			>
				<Form
					form={form}
					layout={'vertical'}
					initialValues={{ type: settingsStore.network.type, rpcUrl: settingsStore.network.rpcUrl }}
					onFinish={onFinish}
					preserve={false}
				>
					<Form.Item name={'type'} label={'Network type'}>
						<Radio.Group onChange={onChange}>
							<Radio.Button value={'MainNet'}>{'MainNet'}</Radio.Button>
							<Radio.Button value={'TestNet'}>{'TestNet'}</Radio.Button>
							<Radio.Button value={'LocalNet'}>{'LocalNet'}</Radio.Button>
						</Radio.Group>
					</Form.Item>

					<Form.Item
						name={'rpcUrl'}
						label={'Network RPC URL'}
						style={!isRpcUrlVisible ? { display: 'none' } : undefined}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>

			<style jsx>{``}</style>
		</>
	);
});
