import { Box, Image, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { collection, getDocs } from "@firebase/firestore";
import React from "react";

import config from "../../../config.json";
import { firestore, tableName } from "../../lib/firebase/web";
import { DynamicNFT } from "../../type/dynamic-nft";

export const Main: React.FC = () => {
  const [dynamicNFTs, setDynamicNFTs] = React.useState<DynamicNFT[]>([]);
  React.useEffect(() => {
    const dynamicNFTs: DynamicNFT[] = [];
    getDocs(collection(firestore, tableName)).then((snapshot) => {
      snapshot.forEach((doc) => {
        dynamicNFTs.push(doc.data() as DynamicNFT);
      });
      setDynamicNFTs(dynamicNFTs);
    });
  }, []);

  return (
    <Box boxShadow={"lg"} borderRadius="2xl" p="4" backgroundColor={config.styles.background.color.main}>
      <Stack spacing="4">
        <Text fontSize="sm" color="blue.400" fontWeight={"bold"}>
          <Link href="/create">{`> Create`}</Link>
        </Text>
        <Text fontWeight="bold" color={config.styles.text.color.primary}>
          Created Dynamic NFTs
        </Text>
        <SimpleGrid columns={{ base: 2, md: 4 }} gap="4" p="4">
          {dynamicNFTs?.map((dynamicNFT) => {
            return (
              <Link href={`/mint/${dynamicNFT.contractAddress}`} key={dynamicNFT.contractAddress}>
                <Image src={dynamicNFT.logo} alt={"logo"} shadow="md" p="6" rounded="xl" />
              </Link>
            );
          })}
        </SimpleGrid>
      </Stack>
    </Box>
  );
};
