import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface ActiveLinkProps extends React.RefAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
  activeLinkClass?: string;
  className?: string;
}
export default function ActiveLink({
  children,
  href,
  activeLinkClass,
  className,
  ...props
}: ActiveLinkProps) {
  const { pathname } = useRouter();
  let classNameNew = className;

  if (pathname === href) {
    classNameNew = `${className} ${
      activeLinkClass ? activeLinkClass : "text-indigo-600"
    }`;
  }

  return (
    <Link href={href} {...props} className={classNameNew}>
      {children}
      {/* {React.cloneElement(children,{className})} */}
    </Link>
  );
}
