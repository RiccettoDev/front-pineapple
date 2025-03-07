"use client";
import { Flex, Stack, useBreakpointValue } from "@chakra-ui/react";

import { useSidebarNav } from "contexts/sidebar.context";
import { SidebarNav } from "./SidebarNav";

const MLSidebar: React.FC = () => {
  let isWideVersion = useBreakpointValue({ base: false, md: true });
  let isWideVersionToVisible = useBreakpointValue({
    base: false,
    md: true,
  });

  const { isOpen } = useSidebarNav();

  if (!isOpen) isWideVersion = false;

  return (
    <Flex
      position={isWideVersionToVisible ? "relative" : "absolute"}
      // @ts-ignore
      overflowX="hidden !important"
      transition="transform 1s ease, opacity 1s ease"
      transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
      opacity={isOpen ? 1 : 0}
      visibility={isOpen ? "visible" : "hidden"}  // Garante que o sidebar não será clicável quando estiver fechado
      className="hideOnPrint"
      display={isWideVersionToVisible ? "block" : "block"}  // Mantém o sidebar em fluxo para o efeito de animação
      w={isOpen ? {base:"70%", sm:'20%'} : "10rem"}  // Ajusta o tamanho dependendo do estado de 'isOpen'
      direction="column"
      align="center"
      minH="90vh"
      bg="#0c0c32"
      overflow={"auto"}
      p={isOpen ? ["4", "4", "6"] : ["4"]}
      as="aside"
      sx={{
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "gray.900",
          borderRadius: "24px",
        },
      }}
      zIndex={500}
    >
      <Stack w="100%" spacing="8">
        <SidebarNav
          isWideVersion={isWideVersion}
          isWideVersionToVisible={isWideVersionToVisible}
        />
      </Stack>
    </Flex>
  );
};

export default MLSidebar;
