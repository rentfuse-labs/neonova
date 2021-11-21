import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useRootStore } from '@stores';
import { Invocation } from '@stores/models';
import { Form, Col, Row, Button, Radio, Input, Typography, Badge } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import useDimensions from 'react-cool-dimensions';

export const BoardItem = observer(function BoardItem({ invocation }: { invocation: Invocation }) {
	const { invocationStore } = useRootStore();

	const { observe: argsListRef, height: argsListHeight } = useDimensions<HTMLDivElement>();
	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		console.log('Received values of form: ', values);
	};

	return (
		<>
			<div className={'m-board-item'}>
				<Row gutter={[16, 16]} style={{ height: '100%' }}>
					<Col span={12} style={{ height: '100%' }}>
						<Form form={form} layout={'vertical'} onFinish={onFinish} style={{ height: '100%' }}>
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
																	<Input placeholder={'Type'} />
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

					<Col span={12}>
						<div style={{ border: '2px solid #eceff1', borderRadius: 4, height: '100%' }}>col-12</div>
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
