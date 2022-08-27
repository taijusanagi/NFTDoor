import { Box, Container, ContainerProps, Flex, Stack } from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";
import { Footer } from "../Footer";
import { Header } from "../Header";

export interface LayoutProps {
  children: React.ReactNode;
  containerProps?: ContainerProps;
}

export const Layout: React.FC<LayoutProps> = ({ children, containerProps = { maxWidth: "4xl" } }) => {
  return (
    <Box backgroundColor={config.styles.background.color.layout}>
      <Flex minHeight={"100vh"} direction={"column"}>
        <Header />
        <Container flex={1} p="4" {...containerProps}>
          <Stack spacing="4">{children}</Stack>
        </Container>
        <Footer />
      </Flex>
    </Box>
  );
};
