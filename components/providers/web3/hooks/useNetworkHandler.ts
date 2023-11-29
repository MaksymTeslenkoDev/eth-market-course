import { useEffect } from "react";
import useSWR, { SWRResponse } from "swr";
import Web3 from "web3";

export type NetworkHandler = SWRResponse & {
  isSupported: boolean;
  targetNetwork?: string;
  hasInitialResponse: boolean;
};

const NETWORKS: Record<number, string> = {
  1: "Ethereum Main Network",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  42: "Kovan Test Network",
  56: "Binance Smart Chain",
  59144: "Linea Mainnet",
  5: "Goerli",
  11155111: "Sepolia",
  59140: "Linea Goerli",
  1337: "Ganache",
};

const targetNetwork =
  process.env.NEXT_PUBLIC_TARGET_CHAIN_ID &&
  NETWORKS[parseInt(process.env.NEXT_PUBLIC_TARGET_CHAIN_ID)];

export const handler = (web3?: Web3 | null) => (): NetworkHandler => {
  const { data, error, ...rest } = useSWR(
    () => (web3 ? "web3/network" : null),
    async () => {
      const netId = (await web3!.eth.getChainId()) as unknown;

      if (!netId)
        throw new Error(
          "Cannot retrieve the network, please refresh the browser"
        );

      return NETWORKS[netId as number];
    }
  );

  return {
    data,
    error,
    targetNetwork,
    isSupported: data === targetNetwork,
    ...rest,
    hasInitialResponse: data || error,
  };
};
