import { Course } from "@/content/courses/types";
import { useHooks, useWeb3 } from "@components/providers/web3/Web3Provider";
import { AccountHandler } from "@components/providers/web3/hooks/useAccountHandler";
import { NetworkHandler } from "@components/providers/web3/hooks/useNetworkHandler";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SWRResponse } from "swr";

type EnhancedHooksRes<T> = T & {
  isEmpty: boolean;
  hasInitialResponse: boolean;
};

const _isEmpty = (data: any) => {
  return (
    data == null ||
    data == undefined ||
    data === "" ||
    (Array.isArray(data) && data.length === 0) ||
    (data.constructor === Object && Object.keys(data).length === 0)
  );
};

const enhanceHook = <T extends SWRResponse>(swrRes: T): EnhancedHooksRes<T> => {
  const { data, error } = swrRes;
  const hasInitialResponse = !!(data || error);
  const isEmpty = hasInitialResponse && _isEmpty(data);

  return {
    ...swrRes,
    isEmpty,
    hasInitialResponse,
  };
};

export const useOwnedCourse = (course: Course, account: string) => {
  const swrRes = enhanceHook(
    useHooks((hooks) => hooks.useOwnedCourse)(course, account)
  );

  return {
    ownedCourse: swrRes,
  };
};

export const useOwnedCourses = (courses: Array<Course>, account: string) => {
  const swrRes = enhanceHook(
    useHooks((hooks) => hooks.useOwnedCourses)(courses, account)
  );

  return {
    ownedCourses: swrRes,
  };
};

export const useAccount = (): EnhancedHooksRes<AccountHandler> => {
  return enhanceHook(useHooks<AccountHandler>((hooks) => hooks.useAccount()));
};

export const useAdmin = ({
  redirectTo,
}: {
  redirectTo: string;
}): AccountHandler => {
  const account = useAccount();
  const { requireInstall } = useWeb3();
  const router = useRouter();

  useEffect(() => {
    if (
      requireInstall ||
      (account.hasInitialResponse && !account.isAdmin) ||
      account.isEmpty
    ) {
      router.push(redirectTo);
    }
  }, [account]);
  return account;
};

export const useNetwork = (): NetworkHandler => {
  return enhanceHook(useHooks<NetworkHandler>((hooks) => hooks.useNetwork()));
};

export const useManagedCourses = (account: AccountHandler) => {
  const swrRes = enhanceHook(
    useHooks((hooks) => hooks.useManagedCourses)(account)
  );
  return {
    managedCourses: swrRes,
  };
};

export const useWalletInfo = () => {
  const { data: account, hasInitialResponse: accounHasInitialResponse } =
    useAccount();
  const {
    data: network,
    isSupported,
    targetNetwork,
    hasInitialResponse: networkHasInitialResponse,
  } = useNetwork();

  const isConnecting = !accounHasInitialResponse && !networkHasInitialResponse;

  return {
    account,
    network,
    hasConnectedWallet: !!(account && isSupported),
    targetNetwork,
    isSupported,
    isConnecting,
  };
};
