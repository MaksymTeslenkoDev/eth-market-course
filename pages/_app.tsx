import "@styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { NextComponentType, NextPageContext } from "next";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const Noop = ({ children }: { children: React.ReactNode }) => <>{children}</>;
type CustomComponent = NextComponentType<NextPageContext, any, any> & {
  Layout: typeof React.Component;
};

interface CustomAppProps extends AppProps {
  Component: CustomComponent;
}
export default function App({ Component, pageProps }: CustomAppProps) {
  const Layout = Component.Layout ?? Noop;
  return (
    <Layout>
      <ToastContainer />
      <Component {...pageProps} />
    </Layout>
  );
}
