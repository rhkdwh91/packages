"use client";

import { ChakraProvider } from "@chakra-ui/react";

export default function ChakraUiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChakraProvider cssVarsRoot="body">{children}</ChakraProvider>;
}
