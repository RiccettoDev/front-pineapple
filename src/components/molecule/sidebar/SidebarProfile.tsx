"use client";
import { Flex, Avatar, Text } from "@chakra-ui/react";

import { useAuth } from "contexts/auth.context";

interface SidebarProfileProps {
  isWideVersion: boolean | any;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({
  isWideVersion,
}) => {
  const { user } = useAuth();
  const { name, email } = user || {};

  return (
    <Flex w="100%" flexDirection="column" align="center" justify="center">
      <Avatar size="md" name={name} />

      {isWideVersion && (
        <>
          <Text mt="2">{name}</Text>
          <Text color="gray.300" fontSize="sm">
            {email}
          </Text>
        </>
      )}
    </Flex>
  );
};
