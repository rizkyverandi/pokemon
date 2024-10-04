import React from "react";
import { Quicksand } from "next/font/google";
import Head from "next/head";
const inter = Quicksand({ subsets: ["latin"] });

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Pokemon</title>
        <meta name="description" content="Pokemon app list" />
      </Head>
      <main className={`${inter.className}`}>{children}</main>
    </>
  );
};

export default Layout;
