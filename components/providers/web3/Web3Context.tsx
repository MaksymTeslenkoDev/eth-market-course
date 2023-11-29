import React from "react";
import Web3 from "web3";
import { HooksMap } from "./hooks/setupHooks";

export type Web3State = {
  provider: object | any; //MetaMaskEthereumProvider
  web3: Web3 | null;
  contract: any;
  isLoading: boolean;
  hooks: HooksMap;
};

export type Web3ContextProps = {
  web3State: Web3State;
  // isWeb3Loaded: boolean;
  requireInstall: boolean;
  // getHooks: () => HooksMap;
  setIsLoading: (value: boolean) => void;
  setWeb3ApiState: (value: Web3State) => void;
  connect: () => void;
};

export const Web3Context = React.createContext<Web3ContextProps>(
  {} as Web3ContextProps
);
