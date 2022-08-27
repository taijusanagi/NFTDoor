import { Box, Button, Flex, HStack, Image, Link, Skeleton, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { doc, getDoc } from "@firebase/firestore";
import axios from "axios";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React from "react";
import { useProvider, useSigner } from "wagmi";

import config from "../../../../config.json";
import { NFTDoor_ABI } from "../../../lib/contracts/NFTDoor";
import { firestore, tableName } from "../../../lib/firebase/web";
import { sleep } from "../../../lib/utils/sleep";
import { DynamicNFT } from "../../../type/dynamic-nft";
import { ConnectWalletWrapper } from "../../ConnectWalletWrapper";
import { Modal } from "../../Modal";
import { Viewer } from "../Viewer";

export const Mint: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const router = useRouter();

  const [dynamicNFT, setDynamicNFT] = React.useState<DynamicNFT>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [tokenId, setTokenId] = React.useState("");
  const [image, setImage] = React.useState("");
  const [effectVideo, setEffectVideo] = React.useState("");
  const [delayTime, setDelayTime] = React.useState(0);

  React.useEffect(() => {
    const { contractAddress } = router.query;
    if (!contractAddress || typeof contractAddress !== "string") {
      return;
    }
    const docRef = doc(firestore, tableName, contractAddress);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        setDynamicNFT(doc.data() as DynamicNFT);
      }
    });
  }, [router]);

  const mint = async () => {
    const { contractAddress } = router.query;
    if (!signer || !dynamicNFT || !contractAddress) {
      return;
    }
    setIsLoading(true);
    const tokenId = "0";

    await sleep(3000);

    // const address = await signer.getAddress();
    // const mintContract = new ethers.Contract(dynamicNFT.contractAddress, NFTDoor_ABI, signer);
    // const tx = await mintContract.requestRandomWords(address, 1);
    // await tx.wait();
    // const filters = mintContract.filters["Minted"];
    // if (filters !== undefined) {
    //   provider.once("block", () => {
    //     mintContract.on(filters(), () => {
    //       console.log("minted");
    //     });
    //   });
    // }\

    const { data } = await axios.get(`/api/metadata/${contractAddress}/${tokenId}`);
    const image = data.image;
    const video = data.video;
    const delayTime = data.delayTime;
    setTokenId(tokenId);
    setImage(image);
    setEffectVideo(video);
    setDelayTime(delayTime);
    onOpen();
    setIsLoading(false);
  };

  return (
    <Box boxShadow={"lg"} borderRadius="2xl" p="4" backgroundColor={config.styles.background.color.main}>
      <Stack spacing="4">
        <Text fontSize="sm" color="blue.400" fontWeight={"bold"}>
          <Link href="/">{`> Home`}</Link>
        </Text>
        <Box>
          <Image src={dynamicNFT?.logo} alt={"logo"} shadow="md" p="8" rounded="xl" fallback={<Skeleton />} />
        </Box>
        <ConnectWalletWrapper>
          <Button
            w="full"
            variant={config.styles.button.variant}
            rounded={config.styles.button.rounded}
            size={config.styles.button.size}
            fontSize={config.styles.button.fontSize}
            color={config.styles.text.color.primary}
            shadow="md"
            onClick={mint}
            isLoading={isLoading}
          >
            Mint
          </Button>
          <Modal isOpen={isOpen} onClose={onClose} header="Minted">
            <Stack spacing="8">
              <Flex justify="center">
                <Viewer image={image} effectVideo={effectVideo} delayTime={delayTime} />
              </Flex>
              <HStack justify="space-between">
                <Button w="full" onClick={onClose}>
                  Back
                </Button>

                <Button
                  w="full"
                  as={Link}
                  target={"_blank"}
                  href={`https://testnets.opensea.io/assets/mumbai/${dynamicNFT?.contractAddress}/${tokenId}`}
                >
                  Opensea
                </Button>
              </HStack>
            </Stack>
          </Modal>
        </ConnectWalletWrapper>
      </Stack>
    </Box>
  );
};
