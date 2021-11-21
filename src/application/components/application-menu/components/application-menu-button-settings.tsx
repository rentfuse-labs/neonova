import { SettingOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Radio, Input } from 'antd';
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@stores';

export const ApplicationMenuButtonSettings = observer(function ApplicationMenuButtonSettings() {
	const { settingsStore } = useRootStore();

	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);

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

	return (
		<>
			<Button type={'default'} shape={'circle'} onClick={showModal} icon={<SettingOutlined />} />

			<Modal
				title={'Settings'}
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
						<Radio.Group>
							<Radio.Button value={'MainNet'}>{'MainNet'}</Radio.Button>
							<Radio.Button value={'TestNet'}>{'TestNet'}</Radio.Button>
							<Radio.Button value={'LocalNet'}>{'LocalNet'}</Radio.Button>
						</Radio.Group>
					</Form.Item>

					<Form.Item name={'rpcUrl'} label={'Network RPC URL'}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>

			<style jsx>{``}</style>
		</>
	);
});
