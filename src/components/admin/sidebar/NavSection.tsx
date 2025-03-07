"use client";
import { Box, Text } from "@chakra-ui/react";

interface NavSectionProps {
  title: string;
  isWideVersion: boolean;
  children: any;
}

export const NavSection: React.FC<NavSectionProps> = ({
  title,
  children,
  isWideVersion,
}) => {
  return (
    <Box w="100%">
      {isWideVersion && (
        <Text
          fontWeight="bold"
          textTransform="uppercase"
          color="primary"
          fontSize="small"
          mb="2"
        >
          {title}
        </Text>
      )}

      {children}
    </Box>
  );
};
