import { Box, ButtonGroup, IconButton, Stack, Text } from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";
import { LinkKey } from "../../type/confg";
import { icons } from "./data";

export const Footer: React.FC = () => {
  return (
    <Box px="4" py="2" as="footer">
      <Stack justify="space-between" direction="row" align="center">
        <Text fontSize="xs" color={config.styles.text.color.secondary}>
          {config.app.description}
        </Text>
        <ButtonGroup variant={"ghost"}>
          {Object.entries(config.links).map(([key, link]) => (
            <IconButton
              key={key}
              as="a"
              href={link.uri}
              target="_blank"
              aria-label={key}
              icon={icons[key as LinkKey]}
            />
          ))}
        </ButtonGroup>
      </Stack>
    </Box>
  );
};
