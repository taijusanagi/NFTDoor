import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { useDisconnect } from "wagmi";

import config from "../../../config.json";

export const Wallet: React.FC = () => {
  const { disconnect } = useDisconnect();

  return (
    <Box>
      <Button
        width="full"
        variant={config.styles.button.variant}
        rounded={config.styles.button.rounded}
        size={config.styles.button.size}
        fontSize={config.styles.button.fontSize}
        color={config.styles.text.color.primary}
        onClick={() => disconnect()}
      >
        Disconnect
      </Button>
    </Box>
  );
};
