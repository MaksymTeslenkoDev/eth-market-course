import { Web3State } from "./Web3Context";
import {
  SET_WEB3,
  SET_CONTRACT,
  SET_IS_LOADING,
  SET_PROVIDER,
  SET_WEB3_STATE,
} from "./ActionTypes";
import Web3 from "web3";

export type Action = {
  type:
    | typeof SET_CONTRACT
    | typeof SET_PROVIDER
    | typeof SET_WEB3
    | typeof SET_IS_LOADING
    | typeof SET_WEB3_STATE;
  payload:
    | { value: string }
    | { value: Web3State }
    | { value: boolean }
    | { value: Web3 };
};

export function Web3Reducer(state: Web3State, action: Action): Web3State {
  switch (action.type) {
    case SET_WEB3_STATE: {
      if (!action.payload) return state;
      if (
        typeof action.payload.value === "object" &&
        "contract" in action.payload.value
      ) {
        return {
          ...state,
          ...action.payload.value,
        };
      }
    }
    case SET_CONTRACT: {
      if (!action.payload) return state;
      if (typeof action.payload.value === "string") {
        return {
          ...state,
          contract: action.payload.value,
        };
      }
    }
    case SET_PROVIDER: {
      if (!action.payload) return state;
      if (typeof action.payload.value === "string") {
        return {
          ...state,
          provider: action.payload.value,
        };
      }
    }
    case SET_WEB3: {
      if (!action.payload) return state;
      if (
        typeof action.payload.value === "object" &&
        "utils" in action.payload.value
      ) {
        return {
          ...state,
          web3: action.payload.value,
        };
      }
    }
    case SET_IS_LOADING: {
      if (!action.payload) return state;
      if (typeof action.payload.value === "boolean") {
        return {
          ...state,
          isLoading: action.payload.value,
        };
      }
    }
    default:
      return state;
  }
}
