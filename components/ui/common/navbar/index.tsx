import { useWeb3 } from "@components/providers";
import { ActiveLink, Button } from "@/components/ui/common";
import Link from "next/link";
import { useAccount } from "@/components/hooks/web3";
import { useRouter } from "next/router";

export default function Navbar() {
  const {
    connect,
    web3State: { isLoading },
    requireInstall,
  } = useWeb3();
  const { pathname } = useRouter();
  const { data: account, isAdmin } = useAccount();

  return (
    <section>
      <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
        <nav className="relative" aria-label="Global">
          <div className="flex flex-col xs:flex-row justify-between items-center">
            <div>
              <ActiveLink
                href="/"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
              >
                Home
              </ActiveLink>
              <ActiveLink
                href="/marketplace"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
              >
                Marketplace
              </ActiveLink>
              <ActiveLink
                href="/blogs"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
              >
                Blogs
              </ActiveLink>
            </div>
            <div className="text-center">
              <ActiveLink
                href="/wishlist"
                className="font-medium sm:mr-8 mr-1 text-gray-500 hover:text-gray-900"
              >
                Wishlist
              </ActiveLink>

              {isLoading ? (
                <Button disabled={true}>Loading...</Button>
              ) : account ? (
                <Button hoverable={false} className="cursor-default ">
                  Hi there {isAdmin && "Admin"}
                </Button>
              ) : requireInstall ? (
                <Button
                  onClick={() =>
                    window.open("https://metamask.io/download/", "_blank")
                  }
                >
                  Install Metamask
                </Button>
              ) : (
                <Button onClick={connect}>Connect</Button>
              )}
            </div>
          </div>
        </nav>
      </div>
      {account && !pathname.includes("marketplace") && (
        <div className="flex justify-end pt-1 sm:px-6 lg:px-8">
          <div className="text-white bg-indigo-600 rounded-md px-2 py-2">
            {account}
          </div>
        </div>
      )}
    </section>
  );
}
