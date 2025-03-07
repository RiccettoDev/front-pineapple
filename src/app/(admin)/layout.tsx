import { Flex } from "@chakra-ui/react";
import { MLHeader } from "components";
import MLSidebar from "components/admin/sidebar";
import { SidebarNavProvider } from "contexts/sidebar.context";

import { QueryClientAndAuthProviders } from "providers/query-auth.provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientAndAuthProviders>
      <SidebarNavProvider>
        <MLHeader />

        <Flex bg={'#0c0c32'}>
          <MLSidebar />

          <Flex
            flex={1}
            minH="88vh"
            flexDirection="column"
            overflowY={"hidden"}
            boxSizing="border-box"
            p={"0"}
            bg={'#0c0c32'}
            sx={{
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "gray.800",
                borderRadius: "24px",
              },
            }}
          >
            {children}
          </Flex>
        </Flex>
      </SidebarNavProvider>
    </QueryClientAndAuthProviders>
  );
}
