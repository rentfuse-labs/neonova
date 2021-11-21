import { Layout, Menu } from 'antd';
import { ProjectOutlined } from '@ant-design/icons';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { ApplicationLogo } from '../application-logo';
import { useMenuNavigation } from './hooks/use-menu-navigation';

export interface Route {
	url: string;
	icon: React.ReactNode;
}

export const ApplicationMenu = React.memo(function ApplicationMenu() {
	const currentKeys = useMenuNavigation();

	const routes = useMemo(() => {
		return [] as Route[];
	}, []);

	return (
		<>
			<Layout.Sider className={'a-menu'} theme={'light'} collapsed={true}>
				<div className={'a-menu-logo'}>
					<ApplicationLogo />
				</div>

				<Menu selectedKeys={currentKeys} mode={'inline'}>
					{routes.map((route) => (
						<Menu.Item
							key={route.url}
							icon={
								<Link href={route.url}>
									<a className={'g-link-no-border'}>{route.icon}</a>
								</Link>
							}
						></Menu.Item>
					))}
				</Menu>
			</Layout.Sider>

			<style jsx>{`
				:global(.a-menu) {
					border-right: 1px solid #eceff1;
					min-height: 100vh;
				}

				.a-menu-logo {
					padding: 16px 20px 16px 20px;
				}
			`}</style>
		</>
	);
});
