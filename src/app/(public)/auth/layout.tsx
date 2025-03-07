import { Flex } from "@chakra-ui/react";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex h={"100vh"} alignItems="center" justifyContent="center" position={"relative"} bg={'#b9fa3c'} p={2}>
      {children}
    </Flex>
  );
}
