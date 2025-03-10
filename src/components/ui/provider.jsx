"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";
import { Theme } from "@chakra-ui/react";
import App from "../../App";

export function Provider(props) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider forcedTheme="dark">
        <Theme appearance="dark">
          <App/>
        </Theme>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default Provider;
