import React from "react";
import { RootStore } from "./root-store";

export const RootStoreContext = React.createContext<RootStore | null>(null);