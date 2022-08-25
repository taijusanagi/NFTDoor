import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";

import config from "../../../config.json";
import { consoleState } from "./consoleState";

export const Console: React.FC = () => {
  const { mode, logs } = useRecoilValue(consoleState);

  return (
    <Box
      shadow="base"
      borderRadius="md"
      p="4"
      minH="24"
      backgroundColor={"gray.800"}
      opacity="90%"
    >
      <Text color="blue.400" fontSize="xs">
        {`${config.app.name} > `}
        {logs.map((log, i) => {
          return (
            <Text
              key={`console-${i}`}
              color={mode === "log" ? "white" : "red.400"}
              fontSize="xs"
              as="span"
              m="0.5"
            >
              {log}
            </Text>
          );
        })}
      </Text>
    </Box>
  );
};
