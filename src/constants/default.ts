// Data taken from https://github.com/neo-project/neo-node/releases/tag/v3.0.3 and neo-visual-tracker
export interface NetworkDataMap {
	[index: string]: {
		nodeListUrl: string;
		networkMagic: number;
	};
}

export const NETWORK_DATA_MAP = {
	LocalNet: {
		nodeListUrl: '',
		networkMagic: 1234567890,
	},
	TestNet: {
		nodeListUrl: 'https://neoscan-testnet.io/api/main_net/v1/get_all_nodes',
		networkMagic: 877933390,
	},
	MainNet: {
		nodeListUrl: 'https://api.neoscan.io/api/main_net/v1/get_all_nodes',
		networkMagic: 860833102,
	},
} as NetworkDataMap;
