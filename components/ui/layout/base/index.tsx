import { Web3Provider } from "@/components/providers";
import { Footer, Navbar } from "@/components/ui/common";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect } from "react";
import Script from "next/script";
import Web3 from "web3";

interface BaseLayoutProps {
  children: React.ReactNode;
}
export default function BaseLayout({ children }: BaseLayoutProps): JSX.Element {
  return (
    <Web3Provider>
      <div className="overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <Navbar />
          <div className="fit">{children}</div>
        </div>
        <Footer />
      </div>
    </Web3Provider>
  );
}
