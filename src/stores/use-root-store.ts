import { useContext } from "react";
import { RootStoreContext } from "./root-store-provider";

export function useRootStore() {
	return useContext(RootStoreContext);
}