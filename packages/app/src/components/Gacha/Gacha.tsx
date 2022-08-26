import { Box, Button, Image, Input, Stack, Text } from "@chakra-ui/react";
import { getContractAddress } from "@ethersproject/address";
import { ContractFactory, ethers } from "ethers";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { v4 } from "uuid";
import { useProvider, useSigner } from "wagmi";

import config from "../../../config.json";
import { NFTDoor_ABI, NFTDoor_bytecode } from "../../lib/contracts/NFTDoor";
import { firestore, storage } from "../../lib/firebase";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";

export interface GachaProps {
  gacha?: any;
}

export const Gacha: React.FC<GachaProps> = ({ gacha }) => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const mint = async () => {
    if (!signer) return;
    const address = await signer.getAddress();
    const mintContract = new ethers.Contract("0x4e90Ddc77aE2CA63d2083f20842a18ec8dDDd9E8", NFTDoor_ABI, signer);
    const tx = await mintContract.requestRandomWords(address, 1);
    await tx.wait();
    const filters = mintContract.filters["Minted"];
    if (filters !== undefined) {
      provider.once("block", () => {
        mintContract.on(filters(), () => {
          console.log("minted");
        });
      });
    }
  };

  return (
    <Box boxShadow={"base"} borderRadius="2xl" p="4" backgroundColor={config.styles.background.color.main}>
      <Stack spacing="4">
        <ConnectWalletWrapper>
          <Button
            w="full"
            variant={config.styles.button.variant}
            rounded={config.styles.button.rounded}
            size={config.styles.button.size}
            fontSize={config.styles.button.fontSize}
            color={config.styles.text.color.primary}
            onClick={mint}
          >
            Mint
          </Button>
        </ConnectWalletWrapper>
      </Stack>
    </Box>
  );
};
