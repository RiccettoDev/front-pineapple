"use client";
import { ChakraProviderApp } from "providers/chakra.provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-bt">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        ></link>

        <link rel="manifest" href="/manifest.json" />

        <link rel="icon" href="/ico.jpeg" type="image/x-icon" />

        <title>PineappleSoccer</title>
      </head>
      <body>
        <ChakraProviderApp>{children}</ChakraProviderApp>
      </body>
    </html>
  );
}
