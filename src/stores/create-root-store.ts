import { NETWORK_DATA_MAP } from '@constants';
import { RootStoreModel } from './root-store';

export function createRootStore() {
	return RootStoreModel.create({
		viewStore: {
			loadingVisible: false,
		},
		settingsStore: {
			network: {
				type: 'TestNet',
				rpcAddress: '',
				networkMagic: NETWORK_DATA_MAP['TestNet'].networkMagic,
			},
		},
		projectStore: {
			projects: [],
		},
	});
}
