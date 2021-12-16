import { WalletDisconnectButton, WalletMultiButton } from '@rentfuse-labs/neo-wallet-adapter-ant-design';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { useRootStore } from '@stores/use-root-store';
import { Button, Form, Input, message, Modal, Space, Upload } from 'antd';
import React, { useState } from 'react';
import { useLocalWallet } from '@wallet';
import { observer } from 'mobx-react-lite';
import { wallet } from '@cityofzion/neon-js';
import { Account } from '@wallet/interfaces';

export const ApplicationButtonWallet = observer(function ApplicationButtonWallet() {
	const { settingsStore } = useRootStore();
	const { connected } = useWallet();
	const { account, setAccount } = useLocalWallet();

	// To handle local wallet form
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);

	// The imported account that is still encrypted
	const [encryptedAccount, setEncryptedAccount] = useState<Account | null>(null);

	const handleOk = () => {
		form.submit();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const autoRequest = (request: any) => {
		setTimeout(() => {
			request.onSuccess('ok');
		}, 0);
	};

	const onFinish = async (values: any) => {
		if (encryptedAccount) {
			try {
				setAccount(values.password?.length ? await encryptedAccount.decrypt(values.password) : encryptedAccount);

				message.success('Local wallet correctly imported');
			} catch (e) {
				message.error('Incorrect password');
			} finally {
				setEncryptedAccount(null);
			}
		}
		setIsModalVisible(false);
	};

	const onImportLocalWallet = (info: any) => {
		setEncryptedAccount(null);

		if (info.file.status === 'done') {
			// Load the wallet and open a modal to insert wallet password to decrypt it
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				try {
					const localWallet = JSON.parse(reader.result as string);
					setEncryptedAccount(new wallet.Account(localWallet.accounts[0]['private-key']));
					setIsModalVisible(true);
				} catch (error) {
					message.error('An error occurred');
				}
			});
			reader.readAsText(info.file.originFileObj);
		} else if (info.file.status === 'error') {
			message.error('An error occurred');
		}
	};

	if (settingsStore.network.type === 'LocalNet') {
		return (
			<>
				{!account ? (
					<Upload
						name={'file'}
						accept={'.json'}
						showUploadList={false}
						customRequest={autoRequest}
						maxCount={1}
						onChange={onImportLocalWallet}
					>
						<Button type={'primary'}>{'Import wallet'}</Button>
					</Upload>
				) : (
					<Space>
						<Button type={'primary'}>{account.address}</Button>
						<Button type={'default'} onClick={() => setAccount(null)}>
							{'Disconnect'}
						</Button>
					</Space>
				)}

				<Modal
					title={'Decrypt wallet'}
					visible={isModalVisible}
					okText={'Decrypt'}
					onOk={handleOk}
					onCancel={handleCancel}
					destroyOnClose={true}
				>
					<Form form={form} layout={'vertical'} onFinish={onFinish} preserve={false}>
						<Form.Item name={'password'} label={'Password'}>
							<Input.Password />
						</Form.Item>
					</Form>
				</Modal>

				<style jsx>{``}</style>
			</>
		);
	} else {
		return (
			<>
				{!connected ? <WalletMultiButton size={'middle'} /> : <WalletDisconnectButton size={'middle'} />}

				<style jsx>{``}</style>
			</>
		);
	}
});
