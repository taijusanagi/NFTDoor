import { Box, Button, Stack } from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { useConsole } from "../Console";

export const Main: React.FC = () => {
  const { console } = useConsole();

  const main = () => {
    console.log("main logic start...");
  };

  return (
    <Box
      boxShadow={"base"}
      borderRadius="2xl"
      p="4"
      backgroundColor={config.styles.background.color.main}
    >
      <Stack spacing="4">
        <ConnectWalletWrapper>
          <Button
            w="full"
            variant={config.styles.button.variant}
            rounded={config.styles.button.rounded}
            size={config.styles.button.size}
            fontSize={config.styles.button.fontSize}
            color={config.styles.text.color.primary}
            onClick={main}
          >
            build something valuable
          </Button>
        </ConnectWalletWrapper>
      </Stack>
    </Box>
  );
};
