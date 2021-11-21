import { WalletOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { WalletMultiButton, WalletDisconnectButton } from '@rentfuse-labs/neo-wallet-adapter-ant-design';

export const ApplicationMenuButtonWallet = observer(function ApplicationMenuButtonWallet() {
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<>
			<Button type={'default'} shape={'circle'} onClick={showModal} icon={<WalletOutlined />} />

			<Modal title={'Select a wallet'} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
				<WalletMultiButton />
				<WalletDisconnectButton />
			</Modal>

			<style jsx>{``}</style>
		</>
	);
});
