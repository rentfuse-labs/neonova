import { ApiOutlined } from '@ant-design/icons';
import { NETWORK_DATA_MAP } from '@constants';
import { useRootStore } from '@stores';
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

export const ApplicationButtonNetwork = observer(function ApplicationButtonNetwork() {
	const { settingsStore } = useRootStore();

	const [form] = Form.useForm();

	const [rpcAddressList, setRpcAddressList] = useState<string[]>([]);

	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [selectedNetworkType, setSelectedNetworkType] = useState(settingsStore.network.type);

	useEffect(() => setSelectedNetworkType(settingsStore.network.type), [settingsStore.network.type]);

	useEffect(() => {
		setRpcAddressList(NETWORK_DATA_MAP[selectedNetworkType].seedUrlList);
	}, [selectedNetworkType]);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		form.submit();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const onChangeNetworkType = (event: any) => {
		const networkType = event.target.value;

		// Reset to already saved values if selected initial type
		if (settingsStore.network.type === networkType) {
			form.setFieldsValue({
				type: networkType,
				rpcAddress: settingsStore.network.rpcAddress,
				networkMagic: settingsStore.network.networkMagic,
			});
		} else {
			// Reset rpcAddress and magic if changed to another one
			form.setFieldsValue({
				type: networkType,
				rpcAddress: '',
				networkMagic: NETWORK_DATA_MAP[networkType].networkMagic,
			});
		}

		// Save the new selected network type to show the correct form items
		setSelectedNetworkType(networkType);
	};

	const onFinish = (values: any) => {
		settingsStore.setNetwork({ type: values.type, rpcAddress: values.rpcAddress, networkMagic: +values.networkMagic });
		setIsModalVisible(false);
	};

	return (
		<>
			<Button icon={<ApiOutlined />} type={'dashed'} onClick={showModal}>
				{settingsStore.network.type}
			</Button>

			<Modal
				visible={isModalVisible}
				title={'Network'}
				okText={'Save'}
				onOk={handleOk}
				onCancel={handleCancel}
				destroyOnClose={true}
			>
				<Form
					form={form}
					layout={'vertical'}
					initialValues={{
						type: settingsStore.network.type,
						rpcAddress: settingsStore.network.rpcAddress,
						networkMagic: settingsStore.network.networkMagic,
					}}
					onFinish={onFinish}
					preserve={false}
				>
					<Form.Item name={'type'} label={'Network type'}>
						<Radio.Group onChange={onChangeNetworkType}>
							<Radio.Button value={'MainNet'}>{'MainNet'}</Radio.Button>
							<Radio.Button value={'TestNet'}>{'TestNet'}</Radio.Button>
						</Radio.Group>
					</Form.Item>

					<Form.Item name={'rpcAddress'} label={'RPC Address'}>
						{selectedNetworkType !== 'LocalNet' ? (
							<Select>
								{rpcAddressList.map((_rpcAddress) => (
									<Select.Option key={_rpcAddress} value={_rpcAddress}>
										{_rpcAddress}
									</Select.Option>
								))}
							</Select>
						) : (
							<Input />
						)}
					</Form.Item>

					<Form.Item name={'networkMagic'} label={'Network magic'}>
						<Input type={'number'} disabled={selectedNetworkType === 'MainNet'} />
					</Form.Item>
				</Form>
			</Modal>

			<style jsx>{``}</style>
		</>
	);
});
