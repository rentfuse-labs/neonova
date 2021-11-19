import { types, cast, Instance } from "mobx-state-tree";

export type InvocationArgType = Instance<typeof InvocationArgTypeModel>;
export type InvocationArg = Instance<typeof InvocationArgModel>;
export type InvocationType = Instance<typeof InvocationTypeModel>;
export type Invocation = Instance<typeof InvocationModel>;
export type InvocationStore = Instance<typeof InvocationStoreModel>;

export const InvocationArgTypeModel = types.enumeration('InvocationArgTypeModel', ['UInt160', 'String']); // TODO: Add the others

export const InvocationArgModel = types.model('InvocationArgModel', {
  type: InvocationArgTypeModel,
  value: types.string,
});

export const InvocationTypeModel = types.enumeration('InvocationTypeModel', ['read', 'write']);

export const InvocationModel = types.model('InvocationModel', {
  id: types.identifier,
  type: InvocationTypeModel,
  scriptHash: types.string,
  operation: types.string,
  args: types.array(InvocationArgModel)
}).actions(self => ({
  setType(type: InvocationType) {
    self.type = type
  },
  setScriptHash(scriptHash: string) {
    self.scriptHash = scriptHash;
  },
  setOperation(operation: string) {
    self.operation = operation;
  },
  setArgs(args: InvocationArg[]) {
    self.args = cast(args);
  }
}));

export const InvocationStoreModel = types
  .model('InvocationStoreModel', {
    invocations: types.array(InvocationModel)
  })
  .actions((self) => ({
    addInvocation(invocation: Invocation) {
      self.invocations.push(invocation);
    },
    removeInvocation(id: string) {
      const index = self.invocations.findIndex(_invocation => _invocation.id === id);
      if (index !== -1) {
        self.invocations.splice(index, 1);
      }
    }
  }));