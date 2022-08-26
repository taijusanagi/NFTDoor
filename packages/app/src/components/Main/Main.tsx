import { Box, Button, Stack } from "@chakra-ui/react";
import { getContractAddress } from "@ethersproject/address";
import { ContractFactory, ethers } from "ethers";
import React from "react";
import { useProvider, useSigner } from "wagmi";

import config from "../../../config.json";
import { NFTDoor_ABI, NFTDoor_bytecode } from "../../lib/contracts/NFTDoor";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";

export const Main: React.FC = () => {
  const { data: signer } = useSigner();

  const provider = useProvider();
  const deploy = async () => {
    if (!signer) return;
    const transactionCount = await signer.getTransactionCount();
    const address = await signer.getAddress();
    const futureAddress = getContractAddress({
      from: address,
      nonce: transactionCount,
    });
    console.log(futureAddress);
    const factory = new ContractFactory(NFTDoor_ABI, NFTDoor_bytecode, signer);
    console.log(factory);
    const tx = await factory.deploy(1591, "name", "symbol", `url/metadata/${futureAddress}/`, 100, "100000");
    console.log(tx);
  };

  const mint = async () => {
    console.log("mint");
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
            onClick={deploy}
          >
            Deploy Contract
          </Button>
          <Button
            w="full"
            variant={config.styles.button.variant}
            rounded={config.styles.button.rounded}
            size={config.styles.button.size}
            fontSize={config.styles.button.fontSize}
            color={config.styles.text.color.primary}
            onClick={mint}
          >
            mint NFT
          </Button>
        </ConnectWalletWrapper>
      </Stack>
    </Box>
  );
};
