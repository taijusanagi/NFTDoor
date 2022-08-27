import type { NextPage } from "next";
import React from "react";

import { Layout } from "../components/Layout";
import { Main } from "../components/Main";
import { SEO } from "../components/SEO";

const Home: NextPage = () => {
  return (
    <Layout containerProps={{ maxW: "4xl" }}>
      <SEO />
      <Main />
    </Layout>
  );
};

export default Home;
