import {
  Box,
  Modal as _Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";

export interface ModalProps {
  header?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ header, children, isOpen, onClose }) => {
  return (
    <Box>
      <_Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior={"outside"}>
        <ModalOverlay />
        <ModalContent m="2">
          <ModalHeader>
            {header && (
              <Text fontSize="sm" color={config.styles.text.color.primary}>
                {header}
              </Text>
            )}
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody px="6" pt="2" pb="8">
            {children}
          </ModalBody>
        </ModalContent>
      </_Modal>
    </Box>
  );
};
