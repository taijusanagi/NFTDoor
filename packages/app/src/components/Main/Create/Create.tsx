import { Box, Button, Flex, FormControl, Image, Input, Link, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { ethers } from "ethers";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React from "react";
import { useNetwork, useSigner } from "wagmi";

import config from "../../../../config.json";
import { useIsMounted } from "../../../hooks/useIsMounted";
import {
  callbackGasLimit,
  coordinatorAddress,
  keyHash,
  requestConfirmations,
  subscription,
} from "../../../lib/contracts/config";
import NFTDoorArtifact from "../../../lib/contracts/NFTDoor.json";
import { firestore, tableName } from "../../../lib/firebase/web";
import { DynamicNFT } from "../../../type/dynamic-nft";
import { ConnectWalletWrapper } from "../../ConnectWalletWrapper";
import { Viewer } from "../Viewer";

export const Create: React.FC = () => {
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const [name, setName] = React.useState("Dynamic NFT with Chainlink VRF V2");
  const [symbol, setSymbol] = React.useState("DNFT");
  const [totalSupply, setTotalSupply] = React.useState("1000");
  const [price, setPrice] = React.useState("0.01");

  /*
   * @dev contents edit is not implemented yet
   */
  const [logo, setLogo] = React.useState(`${config.app.uri}/img/samples/gacha.png`);
  const [commonImage, setCommonImage] = React.useState(`${config.app.uri}/img/samples/common.png`);
  const [rareImage, setRareImage] = React.useState(`${config.app.uri}/img/samples/rare.png`);
  const [commonVideo, setCommonVideo] = React.useState(`${config.app.uri}/img/samples/common.mp4`);
  const [rareVideo, setRareVideo] = React.useState(`${config.app.uri}/img/samples/rare.mp4`);
  const [commonVideoDelayTime, setCommonVideoDelayTime] = React.useState(1250);
  const [rareVideoDelayTime, setRareVideoDelayTime] = React.useState(9000);
  const [commonPercentage, setCommonPercentage] = React.useState(70);

  const { isMounted } = useIsMounted();

  const percantageBase = 100;

  const create = async () => {
    if (!chain || !signer) {
      return;
    }
    setIsLoading(true);
    try {
      const connectedChainId = chain.id;
      if (config.app.chainId !== connectedChainId) {
        alert("please connect to polygon mumbai");
        return;
      }

      const transactionCount = await signer.getTransactionCount();
      const address = await signer.getAddress();
      const computedDeployedContractAddress = ethers.utils.getContractAddress({
        from: address,
        nonce: transactionCount,
      });
      const priceInWei = ethers.utils.parseEther(price).toString();
      const factory = new ethers.ContractFactory(NFTDoorArtifact.abi, NFTDoorArtifact.bytecode, signer);
      console.log("deploying contract...");
      console.log(`${config.app.uri}/api/metadata/${computedDeployedContractAddress}/`);
      return;
      const deployed = await factory.deploy(
        coordinatorAddress,
        subscription,
        keyHash,
        callbackGasLimit,
        requestConfirmations,
        name,
        symbol,
        `${config.app.uri}/api/metadata/${computedDeployedContractAddress}/`,
        totalSupply,
        priceInWei
      );
      console.log("contract deployed", deployed.address);
      console.log("adding consumer...");
      const { data } = await axios.post(`/api/addConsumer/${deployed.address}`);
      console.log("added consumer", data.hash);

      const docRef = doc(firestore, tableName, computedDeployedContractAddress);
      const rarePercentage = percantageBase - commonPercentage;
      const dynamicNFT: DynamicNFT = {
        creator: address,
        contractAddress: computedDeployedContractAddress,
        name,
        symbol,
        logo,
        totalSupply,
        priceInWei,
        contents: [
          { percentage: commonPercentage, image: commonImage, video: commonVideo, videDelayTime: commonVideoDelayTime },
          { percentage: rarePercentage, image: rareImage, video: rareVideo, videDelayTime: rareVideoDelayTime },
        ],
      };
      await setDoc(docRef, dynamicNFT);
      await router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box boxShadow={"lg"} borderRadius="2xl" p="4" backgroundColor={config.styles.background.color.main}>
      <Stack spacing="4">
        <Text fontSize="sm" color="blue.400" fontWeight={"bold"}>
          <Link href="/">{`> Home`}</Link>
        </Text>
        <Text fontWeight="bold" color={config.styles.text.color.primary}>
          Create Dynamic NFT
        </Text>
        <Text fontSize="xs" color={config.styles.text.color.secondary}>
          * Please connext to Polygon Mumbai.
        </Text>
        <Text fontSize="xs" color={config.styles.text.color.secondary}>
          * Default data is set, for the better demo.
        </Text>
        <Text fontSize="xs" color={config.styles.text.color.secondary}>
          * Contents and rarity edit will be implemented later.
        </Text>
        <FormControl>
          <Text mb="1" fontSize="sm" fontWeight="bold" color={config.styles.text.color.primary}>
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
          <Text mb="1" fontSize="sm" fontWeight="bold" color={config.styles.text.color.primary}>
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
          <Text mb="4" fontSize="sm" fontWeight="bold" color={config.styles.text.color.primary}>
            Minting Page Logo
          </Text>
          <Flex justify={"center"}>
            <Image src={logo} alt="minting page image" w="32" h="32" />
          </Flex>
        </FormControl>
        <FormControl>
          <Text mb="1" fontSize="sm" fontWeight="bold" color={config.styles.text.color.primary}>
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
          <Text mb="1" fontSize="sm" fontWeight="bold" color={config.styles.text.color.primary}>
            Price (MATIC)
          </Text>
          <Input
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            value={price}
          />
        </FormControl>
        <Stack spacing="8">
          <FormControl>
            <Text mb="4" fontSize="sm" fontWeight="bold" color={config.styles.text.color.primary}>
              Common Item (70%)
            </Text>
            {isMounted && (
              <Flex justify="center">
                <Viewer image={commonImage} effectVideo={commonVideo} delayTime={2000} isReplayable={true} />
              </Flex>
            )}
          </FormControl>
          <FormControl>
            <Text mb="4" fontSize="sm" fontWeight="bold" color={config.styles.text.color.primary}>
              Rare Item (30%)
            </Text>
            {isMounted && (
              <Flex justify="center">
                <Viewer image={rareImage} effectVideo={rareVideo} delayTime={9000} isReplayable={true} />
              </Flex>
            )}
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
            isLoading={isLoading}
          >
            Create
          </Button>
        </ConnectWalletWrapper>
      </Stack>
    </Box>
  );
};
