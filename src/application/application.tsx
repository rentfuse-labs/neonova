import { Layout, Menu, Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { ApplicationButtonNetwork } from './components/application-button-network';
import { ApplicationButtonWallet } from './components/application-button-wallet';
import { Page } from './interfaces/page';

export const Application = React.memo(function Application({
	pages,
	children,
}: {
	pages: Page[];
	children: React.ReactNode;
}) {
	const router = useRouter();
	const currentPage = pages.find((_page) => _page.url === router.asPath) || null;

	const onClickMenuItem = ({ item, key }: { item: any; key: string }) => {
		router.push(key);
	};

	return (
		<Layout className={'a-layout'}>
			<div className={'a-sider-wrapper'}>
				<Layout.Sider className={'a-sider'} theme={'light'} collapsed={true}>
					<div className={'a-sider-logo'}>
						<Link href={'/'}>
							<a className={'g-link-no-border'}>
								<Image
									src={'/assets/neonova-icon_green.svg'}
									layout={'responsive'}
									width={100}
									height={100}
									alt={'Neonova icon'}
								/>
							</a>
						</Link>
					</div>

					<Menu onClick={onClickMenuItem} selectedKeys={[currentPage?.url || '']} theme={'light'} mode={'inline'}>
						{pages.map((_page) => (
							<Menu.Item key={_page.url} icon={_page.icon} />
						))}
					</Menu>
				</Layout.Sider>
			</div>

			<Layout className={'a-body'}>
				<Layout.Header className={'a-header'}>
					<Typography.Title style={{ margin: 0 }} level={5}>
						{currentPage?.title}
					</Typography.Title>

					<div style={{ display: 'flex', flexDirection: 'row' }}>
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

			<style jsx>{`
				:global(.a-layout) {
					width: 100%;
					min-height: 100vh;
					background: #eceff1;
				}

				:global(.a-sider-wrapper) {
					min-height: 100vh;
					padding: 16px 0px 16px 16px;
				}

				:global(.a-sider) {
					height: 100%;
					border-radius: 4px;
					background: #ffffff;
				}

				:global(.a-sider .ant-layout-sider-children) {
					display: flex;
					flex-direction: column;
				}

				.a-sider-logo {
					padding: 14px 26px 14px 26px;
				}

				:global(.a-body) {
					width: 100%;
					min-height: 100vh;
					padding: 16px;
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
					border-radius: 4px;
					background: #ffffff;
				}

				:global(.a-content) {
					height: 100%;
					padding: 0px;
				}
			`}</style>
		</Layout>
	);
});
