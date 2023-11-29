import Web3 from "web3";
import {
  AccountHandler,
  handler as createAccountHook,
} from "./useAccountHandler";

import {
  NetworkHandler,
  handler as createNetworkHook,
} from "./useNetworkHandler";

import {
  OwnedCoursesHandler,
  handler as createOwnedCoursesHook,
} from "./useOwnedCourses";

import {
  handler as createManagedCourseHook,
  ManagedCourseHandler,
} from "./useManagedCourse";

import {
  OwnedCourseHandler,
  handler as createOwnedCourseHook,
} from "./useOwnedCourse";
import { Course } from "@/content/courses/types";

export type HooksMap = {
  useAccount: () => AccountHandler;
  useNetwork: () => NetworkHandler;
  useOwnedCourses: (
    courses: Array<Course>,
    account: string
  ) => OwnedCoursesHandler;
  useOwnedCourse: (web3: Course, account: string) => OwnedCourseHandler;
  useManagedCourses: (account: AccountHandler) => ManagedCourseHandler;
};

export const setupHooks = (
  provider?: any,
  web3?: Web3 | null,
  contract?: any
): HooksMap => {
  return {
    useAccount: createAccountHook(provider, web3),
    useNetwork: createNetworkHook(web3),
    useOwnedCourses: createOwnedCoursesHook(web3, contract),
    useOwnedCourse: createOwnedCourseHook(web3, contract),
    useManagedCourses: createManagedCourseHook(web3, contract),
  };
};
