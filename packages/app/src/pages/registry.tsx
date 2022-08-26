import type { NextPage } from "next";

import { Layout } from "../components/Layout";
import { Registry as RegistryTemplate } from "../components/Registry";
import { SEO } from "../components/SEO";

const Registry: NextPage = () => {
  return (
    <Layout>
      <SEO />
      <RegistryTemplate />
    </Layout>
  );
};

export default Registry;
