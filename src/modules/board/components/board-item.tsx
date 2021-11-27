import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Neon, { wallet } from '@cityofzion/neon-js';
import { waitTx, WitnessScope } from '@rentfuse-labs/neo-wallet-adapter-base';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { useRootStore } from '@stores';
import { Invocation, INVOCATION_ARG_TYPE_LIST } from '@stores/models';
import { useLocalWallet } from '@wallet';
import { Badge, Button, Col, Form, Input, message, Radio, Row, Select, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import useDimensions from 'react-cool-dimensions';
import { fromStackItem, toInvocationArgument } from '../utils';

// Use this trick to correctly load react-json-view in nextjs
const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });

export const BoardItem = observer(function BoardItem({ invocation }: { invocation: Invocation }) {
	const { viewStore, settingsStore, invocationStore } = useRootStore();
	const { address, connected, invoke } = useWallet();
	const { account } = useLocalWallet();

	const { observe: argsListRef, height: argsListHeight } = useDimensions<HTMLDivElement>();

	const [form] = Form.useForm();
	const [resultJson, setResultJson] = useState<any | null>(null);

	const onFinish = async (values: any) => {
		setResultJson(null);
		viewStore.setLoadingVisible(true);

		const isLocal = settingsStore.network.type === 'LocalNet';
		const isRead = values.type === 'read';

		try {
			if (isLocal) {
				if (isRead) {
					const contract = new Neon.experimental.SmartContract(Neon.u.HexString.fromHex(values.scriptHash), {
						networkMagic: settingsStore.network.networkMagic,
						rpcAddress: settingsStore.network.rpcAddress,
					});
					const result = await contract.testInvoke(
						values.operation,
						values.args.map((_arg: any) => toInvocationArgument(_arg.type, _arg.value)),
					);

					// With bytestring conversion
					setResultJson({
						...result,
						stack: result.stack.map((_item) => ({ ..._item, value: fromStackItem(_item.type, _item.value) })),
					});
				} else {
					if (!account) {
						message.error('You need to connect a wallet to execute a write invocation');
						return;
					}

					const contract = new Neon.experimental.SmartContract(Neon.u.HexString.fromHex(values.scriptHash), {
						networkMagic: settingsStore.network.networkMagic,
						rpcAddress: settingsStore.network.rpcAddress,
						account: account as any,
					});
					const result = await contract.invoke(
						values.operation,
						values.args.map((_arg: any) => toInvocationArgument(_arg.type, _arg.value)),
					);

					await waitTx(settingsStore.network.rpcAddress, result);
				}
			} else {
				if (isRead) {
					const contract = new Neon.experimental.SmartContract(Neon.u.HexString.fromHex(values.scriptHash), {
						networkMagic: settingsStore.network.networkMagic,
						rpcAddress: settingsStore.network.rpcAddress,
					});
					const result = await contract.testInvoke(
						values.operation,
						values.args.map((_arg: any) => toInvocationArgument(_arg.type, _arg.value)),
					);

					// With bytestring conversion
					setResultJson({
						...result,
						stack: result.stack.map((_item) => ({ ..._item, value: fromStackItem(_item.type, _item.value) })),
					});
				} else {
					if (!address || !connected) {
						message.error('You need to connect a wallet to execute a write invocation');
						return;
					}

					const result = await invoke({
						scriptHash: values.scriptHash,
						operation: values.operation,
						args: values.args.map((_arg: any) => toInvocationArgument(_arg.type, _arg.value)),
						signers: [
							{
								account: wallet.getScriptHashFromAddress(address),
								scope: WitnessScope.Global,
							},
						],
					});

					if (result.data?.txId) {
						await waitTx(settingsStore.network.rpcAddress, result.data?.txId);
					}
				}
			}
		} catch (error) {
			console.error(error);
			message.error('An error occurred while doing the invocation');
		} finally {
			viewStore.setLoadingVisible(false);
		}
	};

	const onValuesChange = (changedValues: any, allValues: any) => {
		invocationStore.updateInvocation({
			id: invocation.id,
			type: allValues.type,
			scriptHash: allValues.scriptHash,
			operation: allValues.operation,
			args: allValues.args,
		} as Invocation);
	};

	return (
		<>
			<div className={'m-board-item'}>
				<Row gutter={[16, 16]} style={{ height: '100%' }}>
					<Col span={8} style={{ height: '100%' }}>
						<Form
							form={form}
							initialValues={{
								type: invocation.type,
								scriptHash: invocation.scriptHash,
								operation: invocation.operation,
								args: invocation.args,
							}}
							layout={'vertical'}
							onFinish={onFinish}
							onValuesChange={onValuesChange}
							style={{ height: '100%' }}
						>
							<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
								<div>
									<Form.Item name={'type'} label={'Type'} rules={[{ required: true }]}>
										<Radio.Group>
											<Radio.Button value={'read'}>{'Read'}</Radio.Button>
											<Radio.Button value={'write'}>{'Write'}</Radio.Button>
										</Radio.Group>
									</Form.Item>

									<Form.Item name={'scriptHash'} label={'ScriptHash'} rules={[{ required: true }]}>
										<Input />
									</Form.Item>

									<Form.Item name={'operation'} label={'Operation'} rules={[{ required: true }]}>
										<Input />
									</Form.Item>
								</div>

								<div ref={argsListRef} style={{ flex: 1 }}>
									<Form.List name={'args'}>
										{(fields, { add, remove }) => (
											<>
												<div
													style={{
														display: 'flex',
														flexDirection: 'row',
														justifyContent: 'space-between',
														alignItems: 'center',
														marginBottom: 16,
													}}
												>
													<span>
														<Typography.Text>{'Arguments'}</Typography.Text>
														<Badge count={fields.length} style={{ marginLeft: 8 }} />
													</span>

													<Button type={'dashed'} onClick={() => add()} icon={<PlusOutlined />} />
												</div>

												<div style={{ height: argsListHeight - 60, overflow: 'auto' }}>
													{fields.map(({ key, name, fieldKey, ...restField }) => (
														<div
															key={key}
															style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
														>
															<div style={{ flex: 1, marginRight: 8 }}>
																<Form.Item
																	{...restField}
																	name={[name, 'type']}
																	fieldKey={[fieldKey, 'type']}
																	rules={[{ required: true }]}
																	style={{ margin: 0, padding: 0 }}
																>
																	<Select placeholder={'Type'}>
																		{INVOCATION_ARG_TYPE_LIST.filter(
																			(_key) => !['Signature', 'Map', 'InteropInterface'].includes(_key),
																		).map((_key) => (
																			<Select.Option key={_key} value={_key}>
																				{_key}
																			</Select.Option>
																		))}
																	</Select>
																</Form.Item>
															</div>

															<div style={{ flex: 1, marginLeft: 8, marginRight: 8 }}>
																<Form.Item
																	{...restField}
																	name={[name, 'value']}
																	fieldKey={[fieldKey, 'value']}
																	rules={[{ required: true }]}
																	style={{ margin: 0, padding: 0 }}
																>
																	<Input placeholder={'Value'} />
																</Form.Item>
															</div>

															<div style={{ marginLeft: 8, marginRight: 8 }}>
																<MinusCircleOutlined onClick={() => remove(name)} />
															</div>
														</div>
													))}
												</div>
											</>
										)}
									</Form.List>
								</div>

								<div>
									<Form.Item style={{ marginBottom: 0 }}>
										<Button htmlType={'submit'} type={'primary'} size={'large'} block={true}>
											{'Send'}
										</Button>
									</Form.Item>
								</div>
							</div>
						</Form>
					</Col>

					<Col span={16}>
						<DynamicReactJson
							src={resultJson || { hint: 'Send an invocation to see some data!' }}
							name={null}
							indentWidth={2}
							displayDataTypes={false}
							displayObjectSize={false}
							enableClipboard={false}
							theme={'google'}
							style={{ padding: 16, borderRadius: 4, height: '100%' }}
						/>
					</Col>
				</Row>
			</div>

			<style jsx>{`
				.m-board-item {
					height: 100%;
				}

				.m-board-item-row {
				}
			`}</style>
		</>
	);
});
