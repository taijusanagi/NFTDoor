import type { NextPage } from "next";
import React from "react";

import { Layout } from "../../components/Layout";
import { Mint } from "../../components/Main/Mint";
import { SEO } from "../../components/SEO";

const MintPage: NextPage = () => {
  return (
    <Layout containerProps={{ maxW: "md" }}>
      <SEO />
      <Mint />
    </Layout>
  );
};

export default MintPage;
