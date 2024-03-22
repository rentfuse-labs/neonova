import cuid from 'cuid';
import { types, cast, Instance } from 'mobx-state-tree';

export type InvocationArgType = Instance<typeof InvocationArgTypeModel>;
export type InvocationArg = Instance<typeof InvocationArgModel>;
export type InvocationType = Instance<typeof InvocationTypeModel>;
export type Invocation = Instance<typeof InvocationModel>;

export const INVOCATION_ARG_TYPE_LIST = [
	'Any',
	'Boolean',
	'Integer',
	'ByteArray',
	'String',
	'Hash160',
	'Hash256',
	'PublicKey',
	'Signature',
	'Array',
	'Map',
	'InteropInterface',
	'Void',
];

export const InvocationArgTypeModel = types.enumeration('InvocationArgTypeModel', INVOCATION_ARG_TYPE_LIST);

export const InvocationArgModel = types.model('InvocationArgModel', {
	type: types.optional(InvocationArgTypeModel, 'Any'),
	value: types.optional(types.string, ''),
});

export const InvocationTypeModel = types.enumeration('InvocationTypeModel', ['read', 'write']);

export const InvocationModel = types
	.model('InvocationModel', {
		id: types.identifier,
		type: InvocationTypeModel,
		scriptHash: types.string,
		operation: types.string,
		args: types.array(InvocationArgModel),
		quantity: types.optional(types.number, 1),
		scope: types.optional(types.number, 1),
		allowedContracts: types.optional(types.string, ''),
	})
	.actions((self) => ({}));

export function getDefaultInvocation() {
	return {
		id: cuid(),
		type: 'read',
		scriptHash: '',
		operation: '',
		args: [],
		quantity: 1,
		scope: 1,
		allowedContacts: '',
	} as any;
}
