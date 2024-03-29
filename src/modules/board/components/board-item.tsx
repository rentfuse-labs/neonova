import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Neon, { u, wallet } from '@cityofzion/neon-js';
import { WitnessScope } from '@rentfuse-labs/neo-wallet-adapter-base';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { useRootStore } from '@stores';
import { INVOCATION_ARG_TYPE_LIST, Invocation, Project } from '@stores/models';
import { toInvocationArgument, toStackItemValue } from '@utils';
import { Badge, Button, Col, Form, Input, InputNumber, Radio, Row, Select, Typography, message } from 'antd';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import useDimensions from 'react-cool-dimensions';
import { OnCopyProps, OnSelectProps } from 'react-json-view';

// Use this trick to correctly load react-json-view in nextjs
const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });

// Utility function to update a nested object
function updateNestedData(obj: any, value: any, propPath: string) {
	const [head, ...rest] = propPath.split('.');
	!rest.length ? (obj[head] = value) : updateNestedData(obj[head], value, rest.join('.'));
}

export const BoardItem = observer(function BoardItem({
	project,
	invocation,
}: {
	project: Project;
	invocation: Invocation;
}) {
	const { viewStore, settingsStore, projectStore } = useRootStore();
	const { address, connected, invokeMulti } = useWallet();

	const { observe: argsListRef, height: argsListHeight } = useDimensions<HTMLDivElement>();
	const { observe: jsonViewRef, height: jsonViewHeight } = useDimensions<HTMLDivElement>();

	const [form] = Form.useForm();
	const [resultJson, setResultJson] = useState<any | null>(null);
	const [onegateLink, setOnegateLink] = useState<string | null>(null);

	const jsonMutationMap = useRef<any>({});

	const onFinish = async (values: any) => {
		setResultJson(null);
		setOnegateLink(null);
		jsonMutationMap.current = {};

		viewStore.setLoadingVisible(true);

		const isLocal = settingsStore.network.type === 'LocalNet';
		const isRead = values.type === 'read';

		try {
			// NB: Local not supported but left for compatibility
			if (!isLocal) {
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
						stack: result.stack.map((_item) => ({ ..._item, value: toStackItemValue(_item.type, _item.value) })),
					});
				} else {
					if (!address || !connected) {
						message.error('You need to connect a wallet to execute a write invocation');
						return;
					}

					// Compose invocations depending on quantity
					const invocations = [];
					// Add nft mint with GAS transfer
					for (let i = 0; i < values.quantity; i++) {
						invocations.push({
							scriptHash: values.scriptHash,
							operation: values.operation,
							args: values.args.map((_arg: any) => toInvocationArgument(_arg.type, _arg.value)),
						});
					}

					// Extract scope
					const scopes = values.scope ? (values.scope as WitnessScope) : WitnessScope.CalledByEntry;
					// Extract allowedContracts if needed
					let allowedContracts = undefined;
					// If custom contracts scope try to define it
					if (scopes === 16) {
						try {
							allowedContracts = JSON.parse(values.allowedContracts);
						} catch (e) {
							console.error('Cannot parse allowed contracts as JSON array', e);
						}
					}

					// Execute write invoke
					const result = await invokeMulti({
						invocations,
						signers: [
							{
								account: wallet.getScriptHashFromAddress(address),
								scopes,
								allowedContracts,
							},
						],
					});
					if (result.data?.txId) {
						setResultJson(result);
						setOnegateLink(
							(settingsStore.network.type === 'MainNet'
								? 'https://explorer.onegate.space/transactionInfo/'
								: 'https://testmagnet.explorer.onegate.space/transactionInfo/') + result.data?.txId,
						);
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
		projectStore.updateInvocation(project, {
			id: invocation.id,
			type: allValues.type,
			scriptHash: allValues.scriptHash,
			operation: allValues.operation,
			args: allValues.args.filter((_arg: any) => _arg !== undefined),
			quantity: allValues.quantity || 1,
			scope: allValues.type === 'write' && allValues.scope ? allValues.scope : 1,
			allowedContracts:
				allValues.type === 'write' && allValues.scope === 16 && allValues.allowedContracts
					? allValues.allowedContracts
					: '',
		} as Invocation);
	};

	const onCopyClipboard = (props: OnCopyProps) => {
		// Check if props.src is a string
		if (typeof props.src === 'string') {
			try {
				// If so copy it as a string without quotes
				navigator.clipboard.writeText(props.src);
			} catch (error) {
				console.error('An error occurred copying the string', error);
			}
		}
	};

	const onSelectJson = (props: OnSelectProps) => {
		// Only if something in namespace
		if (!props.namespace.length) {
			return;
		}

		// If txid do nothing
		if (props.name === 'txId' && props.namespace?.[0] === 'data') {
			return;
		}

		// NB: Default is the direct returned value
		// Mutations describe how to represent the value: default, string, number, address
		const mutations = ['default', 'string', 'number', 'address'];
		// The path taken from the props
		const path = props.namespace.join('.') + '.' + props.name;
		// Init mutation and default if not set
		jsonMutationMap.current[path] = {
			mutation: (jsonMutationMap.current[path]?.mutation || 0) + 1,
			default:
				jsonMutationMap.current[path]?.default !== undefined ? jsonMutationMap.current[path].default : props.value,
		};
		// Reset mutation if exceed the possible mutations
		if (jsonMutationMap.current[path]['mutation'] > mutations.length - 1) {
			jsonMutationMap.current[path]['mutation'] = 0;
		}

		// Updated resultJson substituting the corresponding mutation
		setResultJson((_json: any) => {
			const newJson = { ..._json };
			try {
				switch (mutations[jsonMutationMap.current[path]['mutation']]) {
					case 'default':
						updateNestedData(newJson, jsonMutationMap.current[path]['default'], path);
						break;
					case 'string':
						updateNestedData(newJson, u.hexstring2str(u.base642hex(jsonMutationMap.current[path]['default'])), path);
						break;
					case 'number':
						updateNestedData(
							newJson,
							u.HexString.fromHex(u.reverseHex(u.base642hex(jsonMutationMap.current[path]['default']))).toNumber(),
							path,
						);
						break;
					case 'address':
						updateNestedData(
							newJson,
							wallet.getAddressFromScriptHash(u.reverseHex(u.base642hex(jsonMutationMap.current[path]['default']))),
							path,
						);
						break;
				}
			} catch (error) {
				console.error('An error occurred trying to decode selected value', error);
			}
			return newJson;
		});
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
								quantity: invocation.quantity,
								scope: invocation.scope,
								allowedContracts: invocation.allowedContracts,
							}}
							layout={'vertical'}
							onFinish={onFinish}
							onValuesChange={onValuesChange}
							style={{ height: '100%' }}
						>
							<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
								<div>
									<div
										style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
									>
										<div style={{ flex: 1 }}>
											<Form.Item name={'type'} label={'Type'} rules={[{ required: true }]} style={{ marginBottom: 12 }}>
												<Radio.Group>
													<Radio.Button value={'read'}>{'Read'}</Radio.Button>
													<Radio.Button value={'write'}>{'Write'}</Radio.Button>
												</Radio.Group>
											</Form.Item>
										</div>

										{invocation.type === 'write' && (
											<div style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
												<Form.Item
													name={'quantity'}
													label={'Quantity'}
													rules={[{ required: true, type: 'number', min: 1 }]}
													style={{ marginBottom: 12 }}
												>
													<InputNumber />
												</Form.Item>
											</div>
										)}
									</div>

									<Form.Item
										name={'scriptHash'}
										label={'ScriptHash'}
										rules={[{ required: true }]}
										style={{ marginBottom: 12 }}
									>
										<Input />
									</Form.Item>

									<Form.Item
										name={'operation'}
										label={'Operation'}
										rules={[{ required: true }]}
										style={{ marginBottom: 12 }}
									>
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

								<div
									style={{
										width: '100%',
										height: 80,
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}
								>
									<div style={{ flex: 1, marginRight: 8 }}>
										{invocation.type === 'write' && (
											<Form.Item name={'scope'} label={'Scope'} rules={[{ required: invocation.type === 'write' }]}>
												<Select allowClear={false}>
													<Select.Option value={1}>{'Called by entry'}</Select.Option>
													<Select.Option value={16}>{'Custom contracts'}</Select.Option>
													<Select.Option value={128}>{'Global'}</Select.Option>
												</Select>
											</Form.Item>
										)}
									</div>

									<div
										style={{
											flex: 1,
											marginLeft: 8,
										}}
									>
										{invocation.type === 'write' && invocation.scope === 16 && (
											<Form.Item
												name={'allowedContracts'}
												label={'Allowed contracts'}
												rules={[{ required: invocation.type === 'write' && invocation.scope === 16 }]}
											>
												<Input />
											</Form.Item>
										)}
									</div>
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

					<Col ref={jsonViewRef} span={16}>
						<DynamicReactJson
							src={resultJson || { hint: 'Send an invocation to see some data!' }}
							name={null}
							indentWidth={2}
							displayDataTypes={false}
							displayObjectSize={false}
							enableClipboard={onCopyClipboard}
							onSelect={onSelectJson}
							theme={'google'}
							style={{ padding: 16, borderRadius: 4, height: jsonViewHeight, overflow: 'auto' }}
						/>

						{onegateLink && (
							<div
								style={{
									position: 'absolute',
									top: 16,
									right: 24,
									zIndex: 1,
								}}
							>
								<a href={onegateLink} target={'_blank'} rel={'noreferrer'} className={'g-link-no-border'}>
									<Button type={'default'}>{'View on Onegate'}</Button>
								</a>
							</div>
						)}
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
