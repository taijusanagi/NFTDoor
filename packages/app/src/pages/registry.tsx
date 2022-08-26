import type { NextPage } from "next";

import { Layout } from "../components/Layout";
import { Registry as _Registry } from "../components/Registry";
import { SEO } from "../components/SEO";

const Registry: NextPage = () => {
  return (
    <Layout>
      <SEO />
      <_Registry />
    </Layout>
  );
};

export default Registry;
