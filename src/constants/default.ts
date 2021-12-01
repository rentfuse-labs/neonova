// Data taken from https://github.com/neo-project/neo-node/releases/tag/v3.0.3 and neo-visual-tracker
export interface NetworkDataMap {
	[index: string]: {
		nodeListUrl: string;
		networkMagic: number;
		nativeContracts: {
			[index: string]: string;
		};
	};
}

export const NETWORK_DATA_MAP = {
	LocalNet: {
		nodeListUrl: '',
		networkMagic: 1234567890,
		nativeContracts: {
			contractManagement: '0xfffdc93764dbaddd97c48f252a53ea4643faa3fd',
			neo: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
			gas: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
		},
	},
	TestNet: {
		nodeListUrl: 'https://neoscan-testnet.io/api/main_net/v1/get_all_nodes',
		networkMagic: 877933390,
		nativeContracts: {
			contractManagement: '0xfffdc93764dbaddd97c48f252a53ea4643faa3fd',
			neo: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
			gas: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
		},
	},
	MainNet: {
		nodeListUrl: 'https://api.neoscan.io/api/main_net/v1/get_all_nodes',
		networkMagic: 860833102,
		nativeContracts: {
			contractManagement: '0xfffdc93764dbaddd97c48f252a53ea4643faa3fd',
			neo: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
			gas: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
		},
	},
} as NetworkDataMap;
