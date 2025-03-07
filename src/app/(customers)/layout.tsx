'use client';

import { Button, Flex } from "@chakra-ui/react";
import { MLHeader, MLSidebar } from "components";
import { SidebarNavProvider, useSidebarNav } from "contexts/sidebar.context";
import { QueryClientAndAuthProviders } from "providers/query-auth.provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientAndAuthProviders>
      <SidebarNavProvider>
        <LayoutContent>{children}</LayoutContent>
      </SidebarNavProvider>
    </QueryClientAndAuthProviders>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { togglePanel, isOpen } = useSidebarNav();

  return (
    <>
      <MLHeader />

      {/* Overlay - aparece quando o sidebar está aberto */}
      {isOpen && (
        <Button
          display={{base:"flex", lg:'none'}}
          w="100vw"
          h="100vh"
          bg="rgba(0, 0, 0, 0.5)"
          position="fixed"
          top={0}
          left={0}
          zIndex={99}
          onClick={togglePanel}
        />
      )}

      <Flex bg="#0c0c32">
        <MLSidebar />
        <Flex
          flex={1}
          minH="88vh"
          flexDirection="column"
          overflowY="hidden"
          boxSizing="border-box"
          p="0"
          bg="#0c0c32"
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.800",
              borderRadius: "24px",
            },
          }}
        >
          {children}
        </Flex>
      </Flex>
    </>
  );
}
