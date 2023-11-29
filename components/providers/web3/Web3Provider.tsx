import { useContext, useEffect, useMemo, useReducer } from "react";
import { Web3Context, Web3ContextProps, Web3State } from "./Web3Context";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { Web3Reducer } from "./Web3Reducer";
import { SET_IS_LOADING, SET_WEB3_STATE } from "./ActionTypes";
import { HooksMap, setupHooks } from "./hooks/setupHooks";
import { loadContract } from "@/utils/loadContract";

const setListeners = (provider: any) => {
  provider.on("chainChanged", () => window.location.reload());
};

const createWeb3State = (
  web3: Web3 | null,
  provider: any | null,
  contract: any,
  isLoading: boolean
): Web3State => {
  return {
    web3,
    provider,
    contract,
    isLoading,
    hooks: setupHooks(provider, web3, contract),
  };
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [web3State, dispatch] = useReducer(
    Web3Reducer,
    createWeb3State(null, null, null, true)
  );
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3 = new Web3(await detectEthereumProvider());
        const contract = await loadContract("CourseMarketplace", web3);

        setListeners(provider);
        setWeb3ApiState(createWeb3State(web3, provider, contract, false));
      } else {
        setIsLoading(false);
        console.log("Please, install provider");
      }
    };
    loadProvider();
  }, []);

  const setWeb3ApiState = (value: Web3State) => {
    dispatch({ type: SET_WEB3_STATE, payload: { value } });
  };

  const setIsLoading = (value: boolean) => {
    dispatch({ type: SET_IS_LOADING, payload: { value } });
  };

  const connectToMetamask = async () => {
    try {
      await web3State.provider.request({
        method: "eth_requestAccounts",
      });
    } catch {
      location.reload();
    }
  };

  const value = useMemo<Web3ContextProps>(() => {
    const { web3, provider, isLoading } = web3State;
    return {
      web3State,
      requireInstall: !isLoading && !web3,
      connect: provider
        ? connectToMetamask
        : () =>
            console.error(
              "Can't connect to Metamask try to reload your browser"
            ),
      setIsLoading,
      setWeb3ApiState,
    };
  }, [web3State]);

  return (
    <Web3Context.Provider value={value}>
      <div>{children}</div>
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

export function useHooks<T>(cb: (hooks: HooksMap) => T) {
  const {
    web3State: { hooks },
  } = useWeb3();
  return cb(hooks);
}
