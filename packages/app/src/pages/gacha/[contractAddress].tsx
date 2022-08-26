import { collection, doc, getDoc } from "firebase/firestore";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

import { Gacha as GachaTemplate } from "../../components/Gacha";
import { Layout } from "../../components/Layout";
import { SEO } from "../../components/SEO";
import { firestore } from "../../lib/firebase";

const Gacha: NextPage = () => {
  const router = useRouter();
  const [gacha, setGacha] = React.useState<any>();

  React.useEffect(() => {
    const { contractAddress } = router.query;
    const docRef = doc(firestore, "gachas", contractAddress as string);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        setGacha(docSnap.data());
      }
    });

    setGacha;
  }, []);
  return (
    <Layout>
      <SEO />
      <GachaTemplate gacha={gacha} />
    </Layout>
  );
};

export default Gacha;
