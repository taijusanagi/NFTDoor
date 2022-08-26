import type { NextPage } from "next";

import { Layout } from "../components/Layout";
import { Create } from "../components/Main/Create";
import { SEO } from "../components/SEO";

const CreatePage: NextPage = () => {
  return (
    <Layout>
      <SEO />
      <Create />
    </Layout>
  );
};

export default CreatePage;
