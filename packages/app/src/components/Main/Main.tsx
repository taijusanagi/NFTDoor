import { Box, Image, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

import config from "../../../config.json";

export interface MainProps {
  gachas?: any[];
}

export const Main: React.FC<MainProps> = ({ gachas }) => {
  return (
    <Box boxShadow={"base"} borderRadius="2xl" p="4" backgroundColor={config.styles.background.color.main}>
      <Stack spacing="4">
        {gachas?.map((gacha) => {
          return (
            <NextLink href={`/gacha/${gacha.contractAddress}`} key={gacha.contractAddress}>
              <Image src={gacha.keyVisual} alt={gacha.keyVisual}></Image>
            </NextLink>
          );
        })}
      </Stack>
    </Box>
  );
};
