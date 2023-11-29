import { Provider } from "ethers";

declare global {
  interface Window {
    ethereum: Provider;
  }
}
declare module "@metamask/detect-provider";
