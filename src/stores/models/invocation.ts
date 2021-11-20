import cuid from 'cuid';
import { types, cast, Instance } from 'mobx-state-tree';

export type InvocationArgType = Instance<typeof InvocationArgTypeModel>;
export type InvocationArg = Instance<typeof InvocationArgModel>;
export type InvocationType = Instance<typeof InvocationTypeModel>;
export type Invocation = Instance<typeof InvocationModel>;
export type InvocationStore = Instance<typeof InvocationStoreModel>;

export const InvocationArgTypeModel = types.enumeration('InvocationArgTypeModel', [
	'String',
	'Boolean',
	'Hash160',
	'Hash256',
	'Integer',
	'ByteArray',
	'Array',
	'Address',
]);

export const InvocationArgModel = types.model('InvocationArgModel', {
	type: InvocationArgTypeModel,
	value: types.string,
});

export const InvocationTypeModel = types.enumeration('InvocationTypeModel', ['read', 'write']);

export const InvocationModel = types
	.model('InvocationModel', {
		id: types.identifier,
		type: InvocationTypeModel,
		scriptHash: types.string,
		operation: types.string,
		args: types.array(InvocationArgModel),
	})
	.actions((self) => ({
		setType(type: InvocationType) {
			self.type = type;
		},
		setScriptHash(scriptHash: string) {
			self.scriptHash = scriptHash;
		},
		setOperation(operation: string) {
			self.operation = operation;
		},
		setArgs(args: InvocationArg[]) {
			self.args = cast(args);
		},
	}));

// With multiple actions chained for typechecking
export const InvocationStoreModel = types
	.model('InvocationStoreModel', {
		invocations: types.array(InvocationModel),
	})
	.views((self) => ({
		getInvocation(id: string) {
			return self.invocations.find((_invocation) => _invocation.id === id) || null;
		},
		getLastInvocation() {
			if (self.invocations.length) {
				return self.invocations[self.invocations.length - 1];
			}
			return null;
		},
	}))
	.actions((self) => ({
		addInvocation(invocation: Invocation) {
			self.invocations.push(invocation);
		},
		removeInvocation(id: string) {
			const index = self.invocations.findIndex((_invocation) => _invocation.id === id);
			if (index !== -1) {
				self.invocations.splice(index, 1);
			}
		},
		updateInvocation(invocation: Invocation) {
			// TODO: update selected invocation by id
		},
	}))
	.actions((self) => ({
		addDefaultInvocation() {
			self.addInvocation(
				cast({
					id: cuid(),
					type: 'read',
					scriptHash: '',
					operation: '',
					args: [],
				}),
			);
		},
	}));
