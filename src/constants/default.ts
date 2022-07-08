// Data taken from https://github.com/neo-project/neo-node/releases/tag/v3.0.3 and neo-visual-tracker
export interface NetworkDataMap {
	[index: string]: {
		seedUrlList: string[];
		networkMagic: number;
		nativeContracts: {
			[index: string]: string;
		};
	};
}

// NB: Only for V3
export const NETWORK_DATA_MAP = {
	LocalNet: {
		seedUrlList: [],
		networkMagic: 1234567890,
		nativeContracts: {
			contractManagement: '0xfffdc93764dbaddd97c48f252a53ea4643faa3fd',
			neo: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
			gas: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
		},
	},
	TestNet: {
		seedUrlList: [
			'https://testnet1.neo.coz.io:443',
			'https://testnet2.neo.coz.io:443',
			'http://seed1t4.neo.org:20332',
			'http://seed2t4.neo.org:20332',
			'http://seed3t4.neo.org:20332',
			'http://seed4t4.neo.org:20332',
			'http://seed5t4.neo.org:20332',
		],
		networkMagic: 877933390,
		nativeContracts: {
			contractManagement: '0xfffdc93764dbaddd97c48f252a53ea4643faa3fd',
			neo: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
			gas: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
		},
	},
	MainNet: {
		seedUrlList: [
			'https://mainnet1.neo.coz.io:443',
			'https://mainnet2.neo.coz.io:443',
			'http://seed1.neo.org:10332',
			'http://seed2.neo.org:10332',
			'http://seed3.neo.org:10332',
			'http://seed4.neo.org:10332',
			'http://seed5.neo.org:10332',
		],
		networkMagic: 860833102,
		nativeContracts: {
			contractManagement: '0xfffdc93764dbaddd97c48f252a53ea4643faa3fd',
			neo: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
			gas: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
		},
	},
	Other: {
		seedUrlList: [
		],
		networkMagic: 0,
		nativeContracts: {
			contractManagement: '0xfffdc93764dbaddd97c48f252a53ea4643faa3fd',
			neo: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
			gas: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
		},
	},
} as NetworkDataMap;
