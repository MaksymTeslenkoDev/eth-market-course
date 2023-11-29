import { useEffect } from "react";
import Web3 from "web3";
import useSWR, { SWRResponse } from "swr";

export type AccountHandler = SWRResponse & {
  isAdmin: boolean;
};
const adminAddresses: Record<string, boolean> = {
  "0x452c7e8236c77aedef4354daddbfc7493ffa66af4fc08f0c6032cba50b0b31aa": true,
  "0xa5bb53d6aa02bd2a569341f826f6fd8b3bc432289895bc8248a05dcc05bf5d64": true,
};

export const handler =
  (provider: any, web3?: Web3 | null) => (): AccountHandler => {
    const { data, mutate, ...rest } = useSWR<string>(
      web3 ? "web3/accounts" : null,
      async () => {
        const accounts = await web3!.eth.getAccounts();
        const account = accounts[0];
        if (!account) {
          throw new Error(
            "Cannot retrieve an account, please refresh the browser"
          );
        }
        return account;
      }
    );

    useEffect(() => {
      const mutator = (accounts: string[]) => mutate(accounts[0] ?? null);

      provider && provider.on("accountsChanged", mutator);
      return () =>
        provider && provider.removeListener("accountsChanged", mutator);
    }, [provider]);

    const getHashedData = () => {
      if (!web3) return;
      if (!data) return;
      return web3.utils.keccak256(data);
    };

    const isAdmin =
      !!(getHashedData() && adminAddresses[getHashedData()!]) ?? false;

    return {
      isAdmin,
      data,
      mutate,
      ...rest,
    };
  };
