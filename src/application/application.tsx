import { useRootStore } from '@stores/use-root-store';
import { Divider, Layout, Menu, Modal, Spin, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import GithubIcon from '../assets/github-icon.svg';
import NeonovaIcon from '../assets/neonova-icon.svg';
import RentfuseIcon from '../assets/rentfuse-icon.svg';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { ApplicationButtonNetwork } from './components/application-button-network';
import { ApplicationButtonWallet } from './components/application-button-wallet';
import { Page } from './interfaces/page';

export const Application = observer(function Application({
	pages,
	children,
}: {
	pages: Page[];
	children: React.ReactNode;
}) {
	const { viewStore } = useRootStore();

	const router = useRouter();
	const currentPage = pages.find((_page) => _page.url === router.asPath) || null;

	const onClickMenuItem = ({ item, key }: { item: any; key: string }) => {
		router.push(key);
	};

	return (
		<Layout className={'a-layout'}>
			<div className={'a-sider-wrapper'}>
				<Layout.Sider className={'a-sider'} theme={'light'} collapsed={true}>
					<div className={'a-logo'}>
						<Link href={'/'}>
							<a className={'g-link-no-border'}>
								<NeonovaIcon width={28} height={28} fill={'#00e599'} />
							</a>
						</Link>
					</div>

					<Menu
						className={'a-menu'}
						onClick={onClickMenuItem}
						selectedKeys={[currentPage?.url || '']}
						theme={'light'}
						mode={'inline'}
					>
						{pages.map((_page) => (
							<Menu.Item key={_page.url} icon={_page.icon} />
						))}
					</Menu>

					<div
						style={{
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-end',
							alignItems: 'center',
						}}
					>
						<div style={{ marginBottom: 24 }}>
							<a
								href={'https://github.com/rentfuse-labs/neonova'}
								target={'_blank'}
								rel={'noreferrer'}
								className={'g-link-no-border'}
							>
								<GithubIcon width={20} height={20} fill={'#040214'} opacity={0.8} />
							</a>
						</div>

						<div style={{ marginBottom: 24 }}>
							<a href={'https://rentfuse.com'} target={'_blank'} rel={'noreferrer'} className={'g-link-no-border'}>
								<RentfuseIcon width={20} height={20} fill={'#040214'} opacity={0.8} />
							</a>
						</div>
					</div>
				</Layout.Sider>
			</div>

			<Layout className={'a-body'}>
				<Layout.Header className={'a-header'}>
					<Typography.Title style={{ margin: 0 }} level={5}>
						{currentPage?.title}
					</Typography.Title>

					<div style={{ display: 'flex', flexDirection: 'row' }}>
						{currentPage?.extra && (
							<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
								{currentPage.extra}
								<Divider type={'vertical'} style={{ marginLeft: 8, marginRight: 8 }} />
							</div>
						)}

						<div style={{ marginRight: 16 }}>
							<ApplicationButtonNetwork key={'application-button-network'} />
						</div>

						<div style={{}}>
							<ApplicationButtonWallet key={'application-button-wallet'} />
						</div>
					</div>
				</Layout.Header>

				<Layout.Content className={'a-content'}>{children}</Layout.Content>
			</Layout>

			<Modal
				visible={viewStore.loadingVisible}
				closable={false}
				maskClosable={false}
				width={320}
				footer={null}
				className={'a-modal'}
			>
				<Spin size={'large'} />
			</Modal>

			<style jsx>{`
				:global(.a-layout) {
					width: 100%;
					min-height: 100vh;
					background: #eceff1;
				}

				:global(.a-sider-wrapper) {
					min-height: 100vh;
					padding: 0px 16px 0px 0px;
				}

				:global(.a-sider) {
					height: 100%;
					background: #ffffff;
				}

				:global(.a-sider .ant-layout-sider-children) {
					display: flex;
					flex-direction: column;
				}

				:global(.a-menu) {
					border: 0px;
					margin-top: 16px;
				}

				:global(.a-logo) {
					padding: 16px 26px 6px 26px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}

				:global(.a-body) {
					width: 100%;
					min-height: 100vh;
					background: #eceff1;
				}

				:global(.a-header) {
					width: 100%;
					height: 60px;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					padding: 8px 16px 8px 16px;
					margin-bottom: 16px;
					border-radius: 0px 0px 0px 4px;
					background: #ffffff;
				}

				:global(.a-content) {
					height: 100%;
					padding: 0px;
				}

				:global(.a-modal) {
					padding: 30px 50px;
					text-align: center;
				}
			`}</style>
		</Layout>
	);
});
