import { Instance, types } from "mobx-state-tree";
import { InvocationStoreModel } from "./models/invocation";

export type RootStore = Instance<typeof RootStoreModel>;

export const RootStoreModel = types.model('RootStoreModel', {
	invocationStore: InvocationStoreModel,
});