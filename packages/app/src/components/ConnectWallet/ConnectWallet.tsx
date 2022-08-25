import { Box, Button, Image, Stack } from "@chakra-ui/react";
import React from "react";
import { useConnect } from "wagmi";

import config from "../../../config.json";
import { connectors } from "../../lib/wagmi";
import { WalletKey } from "../../type/confg";

export interface ConnectWalletProps {
  callback?: () => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ callback }) => {
  const { connect } = useConnect();

  const connectWallet = (key: WalletKey) => {
    connect({ connector: connectors[key] });
    if (callback) {
      callback();
    }
  };

  return (
    <Box>
      <Stack spacing="4">
        {Object.entries(config.wallets).map(([key, wallet]) => {
          return (
            <Button
              key={key}
              width="full"
              variant={config.styles.button.variant}
              rounded={config.styles.button.rounded}
              size={config.styles.button.size}
              fontSize={config.styles.button.fontSize}
              color={config.styles.text.color.primary}
              onClick={() => connectWallet(key as WalletKey)}
            >
              <Image src={`/img/icons/${wallet.icon}`} alt={key} w="4" mr="2" />
              {wallet.name}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};
