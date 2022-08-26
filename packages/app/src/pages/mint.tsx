import { collection, getDocs } from "firebase/firestore";
import type { NextPage } from "next";
import React from "react";

import { Layout } from "../components/Layout";
import { Main } from "../components/Main";
import { SEO } from "../components/SEO";
import { firestore } from "../lib/firebase";

const MintPage: NextPage = () => {
  const [gachas, setGachas] = React.useState<any[]>([]);
  React.useEffect(() => {
    const gachaList: any[] = [];
    getDocs(collection(firestore, "gachas")).then((snapshot) => {
      snapshot.forEach((doc) => {
        gachaList.push(doc.data());
      });
      setGachas(gachaList);
    });
  }, []);
  return (
    <Layout>
      <SEO />
      <Main gachas={gachas} />
    </Layout>
  );
};

export default MintPage;
