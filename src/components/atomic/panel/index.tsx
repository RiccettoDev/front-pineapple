import { Flex } from "@chakra-ui/react";
import { ATPanelProps } from "interfaces/components/panel";

export default function ATPanel({ children, ...props }: ATPanelProps) {
  return (
    <Flex bg={"panel.bg"} flexDir={"column"} p={8} borderRadius={8} {...props}>
      {children}
    </Flex>
  );
}
