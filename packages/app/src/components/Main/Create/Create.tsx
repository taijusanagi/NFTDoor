import { Box, Button, Flex, FormControl, Image, Input, Link, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useSigner } from "wagmi";

import config from "../../../../config.json";
import { NFTDoor_ABI, NFTDoor_bytecode } from "../../../lib/contracts/NFTDoor";
import { firestore } from "../../../lib/firebase";
import { ConnectWalletWrapper } from "../../ConnectWalletWrapper";

export const Create: React.FC = () => {
  const { data: signer } = useSigner();

  const [name, setName] = React.useState("Dynamic NFT with Chainlink VRF V2");
  const [symbol, setSymbol] = React.useState("DNFT");
  const [logo, setLogo] = React.useState(`${config.app.uri}/img/samples/gacha.png`);

  const [commonImage, setCommonImage] = React.useState(`${config.app.uri}/img/samples/common.png`);
  const [rareImage, setRareImage] = React.useState(`${config.app.uri}/img/samples/rare.png`);
  const [commonVideo, setCommonVideo] = React.useState(`${config.app.uri}/img/samples/common.mp4`);
  const [rareVideo, setRareVideo] = React.useState(`${config.app.uri}/img/samples/rare.mp4`);

  const [totalSupply, setTotalSupply] = React.useState("1000");
  const [price, setPrice] = React.useState("0.01");

  const [commonPercentage, setCommonPercentage] = React.useState(70);

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

  return (
    <Box boxShadow={"lg"} borderRadius="2xl" p="4" backgroundColor={config.styles.background.color.main}>
      <Stack spacing="4">
        <Text fontSize="sm" color="blue.400" fontWeight={"bold"}>
          <Link href="/">{`> Home`}</Link>
        </Text>
        <Text fontWeight="bold">Create Dynamic NFT</Text>
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
        <FormControl>
          <Text mb="1" fontSize="sm" fontWeight="bold">
            Price (MATIC)
          </Text>
          <Input
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            value={price}
          />
        </FormControl>

        <Stack spacing="8" p="8">
          <FormControl>
            <Flex justify="space-between">
              <Box w="full">
                <Flex justify={"center"}>
                  <Image src={commonImage} alt="minting page image" w="32" h="32" />
                </Flex>
              </Box>
              <Box w="full">
                <Flex justify={"center"}>
                  <Box as="video" position="absolute" h="32" controls muted objectFit="fill">
                    <source type="video/mp4" src={commonVideo}></source>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </FormControl>
          <FormControl>
            <Flex justify="space-between">
              <Box w="full">
                <Flex justify={"center"}>
                  <Image src={rareImage} alt="minting page image" w="32" h="32" />
                </Flex>
              </Box>
              <Box w="full">
                <Flex justify={"center"}>
                  <Box as="video" position="absolute" h="32" controls muted objectFit="fill">
                    <source type="video/mp4" src={rareVideo}></source>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </FormControl>
        </Stack>
        <ConnectWalletWrapper>
          <Button
            w="full"
            variant={config.styles.button.variant}
            rounded={config.styles.button.rounded}
            size={config.styles.button.size}
            fontSize={config.styles.button.fontSize}
            color={config.styles.text.color.primary}
            shadow="md"
            onClick={create}
          >
            Create
          </Button>
        </ConnectWalletWrapper>
      </Stack>
    </Box>
  );
};
