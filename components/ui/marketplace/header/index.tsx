import { useAccount } from "@/components/hooks/web3";
import { Breadcrumbs } from "@components/ui/common";
import { EthRates, WalletBar } from "@components/ui/web3";

export type LinkObject = {
  href: string;
  value: string;
  requireAdmin?: boolean;
};

const LINKS = [
  {
    href: "/marketplace",
    value: "Buy",
  },
  {
    href: "/marketplace/courses/owned",
    value: "My Courses",
  },
  {
    href: "/marketplace/courses/managed",
    value: "Manage Courses",
    requireAdmin: true,
  },
];

export default function Header() {
  const { data: account, isAdmin } = useAccount();

  return (
    <>
      <div className="pt-4">
        <WalletBar />
      </div>
      <EthRates />
      <div className="flex flex-row-reverse p-4 sm:px-6 lg:px-8">
        <Breadcrumbs isAdmin={isAdmin} items={LINKS} />
      </div>
    </>
  );
}
