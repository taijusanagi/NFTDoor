import { Box, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { Wallet } from "../Wallet";

export const Header: React.FC = () => {
  return (
    <Box p="4" as="header">
      <Flex justify="space-between" align="center">
        <Text fontWeight={"bold"} color={config.styles.text.color}>
          <Link href="/">{config.app.name}</Link>
        </Text>
        <ConnectWalletWrapper>
          <Wallet />
        </ConnectWalletWrapper>
      </Flex>
    </Box>
  );
};
