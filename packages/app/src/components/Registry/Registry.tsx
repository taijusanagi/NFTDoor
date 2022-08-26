import { Box, Button, Flex, FormControl, Image, Input, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { id } from "ethers/lib/utils";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React from "react";
import { v4 } from "uuid";
import { useSigner } from "wagmi";

import config from "../../../config.json";
import { NFTDoor_ABI, NFTDoor_bytecode } from "../../lib/contracts/NFTDoor";
import { firestore, storage } from "../../lib/firebase";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";

export const Registry: React.FC = () => {
  const { data: signer } = useSigner();
  const [keyImageToUpload, setKeyImageToUpload] = React.useState<File | null>(null);
  const [commonImageToUpload, setCommonImageToUpload] = React.useState<File | null>(null);
  const [rareImageToUpload, setRareImageToUpload] = React.useState<File | null>(null);

  const [name, setName] = React.useState("Dynamic NFT with Chainlink VRF V2");
  const [symbol, setSymbol] = React.useState("DNFT");
  const [logo, setLogo] = React.useState(`${config.app.uri}/img/samples/gacha.png`);
  const [totalSupply, setTotalSupply] = React.useState("1000");
  const [price, setPrice] = React.useState("0.01");

  const [commonPercentage, setCommonPercentage] = React.useState(90);
  const [rarePercentage, setRarePercentage] = React.useState(10);

  const create = async () => {
    if (!signer) {
      return;
    }
    const transactionCount = await signer.getTransactionCount();
    const address = await signer.getAddress();
    const computedDeployedContractAddress = ethers.utils.getContractAddress({
      from: address,
      nonce: transactionCount,
    });
    const priceInWei = ethers.utils.parseEther(price).toString();
    const docRef = doc(firestore, "dynamicNFTCollections", computedDeployedContractAddress);
    await setDoc(docRef, {
      creator: address,
      contractAddress: computedDeployedContractAddress,
      name,
      symbol,
      logo,
      totalSupply,
      priceInWei,
    });
    const factory = new ethers.ContractFactory(NFTDoor_ABI, NFTDoor_bytecode, signer);
    const tx = await factory.deploy(
      config.app.subscriptionId,
      name,
      symbol,
      `${config.app.uri}/api/metadata/${computedDeployedContractAddress}/`,
      totalSupply,
      priceInWei
    );
  };

  const upload = () => {
    if (!keyImageToUpload) return;
    const imageRef = ref(storage, `images/${v4()}`);
    uploadBytes(imageRef, keyImageToUpload).then(() => {
      console.log("uploaded");
      getDownloadURL(imageRef).then((url) => {
        console.log(url);
        setLogo(url);
      });
    });
  };

  const setGachaInfo = async () => {
    if (!commonImageToUpload || !rareImageToUpload) return;
    const docRef = doc(firestore, "gachas", contractAddress);

    const commonImageRef = ref(storage, `images/${v4()}`);
    const rareImageRef = ref(storage, `images/${v4()}`);
    await uploadBytes(commonImageRef, commonImageToUpload);
    await uploadBytes(rareImageRef, rareImageToUpload);
    const commonPath = await getDownloadURL(commonImageRef);
    const rarePath = await getDownloadURL(rareImageRef);
    await updateDoc(docRef, {
      rarityImages: {
        common: commonPath,
        rare: rarePath,
      },
      rarityPercentages: {
        common: commonPercentage,
        rare: rarePercentage,
      },
    });
  };

  return (
    <Box boxShadow={"base"} borderRadius="2xl" p="4" backgroundColor={config.styles.background.color.main}>
      <Stack spacing="4">
        <Text fontWeight="bold" fontSize="sm">
          Create Dynamic NFT with Chainlink VRFV2
        </Text>
        <Text fontSize="xs">* Default data is set, but you can edit the data too.</Text>
        <FormControl>
          <Text mb="1" fontSize="sm" fontWeight="bold">
            Name
          </Text>
          <Input
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
        </FormControl>
        <FormControl>
          <Text mb="1" fontSize="sm" fontWeight="bold">
            Symbol
          </Text>
          <Input
            onChange={(e) => {
              setSymbol(e.target.value);
            }}
            value={symbol}
          />
        </FormControl>
        <FormControl>
          <Text mb="4" fontSize="sm" fontWeight="bold">
            Minting Page Logo
          </Text>
          <Flex justify={"center"}>
            <Image src={logo} alt="minting page image" w="32" h="32" />
          </Flex>
        </FormControl>

        <FormControl>
          <Text mb="1" fontSize="sm" fontWeight="bold">
            Total Supply
          </Text>
          <Input
            onChange={(e) => {
              setTotalSupply(e.target.value);
            }}
            value={totalSupply}
          />
        </FormControl>

        <Text mb="1" fontSize="sm" fontWeight="bold">
          Price (MATIC)
        </Text>
        <Input
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          value={price}
        ></Input>

        <Button
          w="full"
          variant={config.styles.button.variant}
          rounded={config.styles.button.rounded}
          size={config.styles.button.size}
          fontSize={config.styles.button.fontSize}
          color={config.styles.text.color.primary}
          onClick={create}
        >
          Create
        </Button>
      </Stack>
    </Box>
  );
};
