import { Instance, types } from 'mobx-state-tree';

export type SettingsStore = Instance<typeof SettingsStoreModel>;
export type SettingsNetworkType = Instance<typeof SettingsNetworkTypeModel>;
export type SettingsNetwork = Instance<typeof SettingsNetworkModel>;

export const SettingsNetworkTypeModel = types.enumeration('SettingsNetworkTypeModel', [
	'MainNet',
	'TestNet',
	'LocalNet',
]);

export const SettingsNetworkModel = types.model('SettingsNetworkModel', {
	type: SettingsNetworkTypeModel,
	rpcUrl: types.optional(types.string, ''),
});

export const SettingsStoreModel = types
	.model('SettingsStoreModel', {
		network: SettingsNetworkModel,
	})
	.actions((self) => ({
		setNetwork(network: SettingsNetwork) {
			self.network = network;
		},
	}));
