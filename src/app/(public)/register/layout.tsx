import { Flex } from "@chakra-ui/react";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex h={{sm:'100vh'}} alignItems="center" justifyContent="center" position={"relative"} pt={2} pb={8} bg={'#b9fa3c'} >
      {children}
    </Flex>
  );
}
