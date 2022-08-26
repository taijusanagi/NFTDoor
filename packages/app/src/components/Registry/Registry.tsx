import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { getContractAddress } from "@ethersproject/address";
import { ContractFactory } from "ethers";
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
  const [contractAddress, setContractAddress] = React.useState("");
  const [keyVisualPath, setKeyVisualPath] = React.useState("");
  const [name, setName] = React.useState("");
  const [symbol, setSymbol] = React.useState("");
  const [mintLimit, setMintLimit] = React.useState("");
  const [gachaPrice, setGachaPrice] = React.useState("");
  const [commonPercentage, setCommonPercentage] = React.useState(90);
  const [rarePercentage, setRarePercentage] = React.useState(10);

  const deploy = async () => {
    if (!signer || !name || !symbol || !keyVisualPath || !mintLimit || !gachaPrice) return;
    const transactionCount = await signer.getTransactionCount();
    const address = await signer.getAddress();
    const futureAddress = getContractAddress({
      from: address,
      nonce: transactionCount,
    });
    setContractAddress(futureAddress);
    const docRef = doc(firestore, "gachas", futureAddress);
    await setDoc(docRef, {
      creator: address,
      contractAddress: futureAddress,
      name,
      symbol,
      keyVisual: keyVisualPath,
      mintLimit: Number(mintLimit),
      gachaPrice: Number(gachaPrice),
    });
    const factory = new ContractFactory(NFTDoor_ABI, NFTDoor_bytecode, signer);
    console.log(factory);
    const tx = await factory.deploy(1591, name, symbol, `url/metadata/${futureAddress}/`, Number(mintLimit), "100000");
    console.log(tx);
  };

  const upload = () => {
    if (!keyImageToUpload) return;
    const imageRef = ref(storage, `images/${v4()}`);
    uploadBytes(imageRef, keyImageToUpload).then(() => {
      console.log("uploaded");
      getDownloadURL(imageRef).then((url) => {
        console.log(url);
        setKeyVisualPath(url);
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
    <>
      <Box boxShadow={"base"} borderRadius="2xl" p="4" backgroundColor={config.styles.background.color.main}>
        <Stack spacing="4">
          <ConnectWalletWrapper>
            <Text>project name</Text>
            <Input
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="BoredApeYatchClub"
            ></Input>
            <Text>symbol</Text>
            <Input
              onChange={(e) => {
                setSymbol(e.target.value);
              }}
              placeholder="BAYC"
            ></Input>
            <Text>key visual</Text>
            <Input
              onChange={(event) => {
                setKeyImageToUpload(event.target.files![0]);
              }}
              type="file"
            ></Input>
            <Button
              w="full"
              variant={config.styles.button.variant}
              rounded={config.styles.button.rounded}
              size={config.styles.button.size}
              fontSize={config.styles.button.fontSize}
              color={config.styles.text.color.primary}
              onClick={upload}
            >
              Upload
            </Button>
            <Text>mint limit</Text>
            <Input
              onChange={(e) => {
                setMintLimit(e.target.value);
              }}
              placeholder="1000"
            ></Input>

            <Text>gacha price (MATIC)</Text>
            <Input
              onChange={(e) => {
                setGachaPrice(e.target.value);
              }}
              placeholder="0.1"
            ></Input>

            <Button
              w="full"
              variant={config.styles.button.variant}
              rounded={config.styles.button.rounded}
              size={config.styles.button.size}
              fontSize={config.styles.button.fontSize}
              color={config.styles.text.color.primary}
              onClick={deploy}
            >
              Deploy Contract
            </Button>
          </ConnectWalletWrapper>
        </Stack>
      </Box>
      <Box boxShadow={"base"} borderRadius="2xl" p="4" backgroundColor={config.styles.background.color.main}>
        <Stack spacing="4">
          <ConnectWalletWrapper>
            <Text>Gacha Setting</Text>
            <Text>Common %</Text>
            <Input
              onChange={(e) => {
                setCommonPercentage(Number(e.target.value));
                setRarePercentage(100 - Number(e.target.value));
              }}
              type="number"
              placeholder="90"
            ></Input>
            <Text>Common visual</Text>
            <Input
              onChange={(event) => {
                setCommonImageToUpload(event.target.files![0]);
              }}
              type="file"
            ></Input>
            <Text>Rare %</Text>
            <Input disabled value={rarePercentage}></Input>
            <Text>Rare visual</Text>
            <Input
              onChange={(event) => {
                setRareImageToUpload(event.target.files![0]);
              }}
              type="file"
            ></Input>
            <Button
              w="full"
              variant={config.styles.button.variant}
              rounded={config.styles.button.rounded}
              size={config.styles.button.size}
              fontSize={config.styles.button.fontSize}
              color={config.styles.text.color.primary}
              onClick={setGachaInfo}
            >
              Set NFT
            </Button>
          </ConnectWalletWrapper>
        </Stack>
      </Box>
    </>
  );
};
