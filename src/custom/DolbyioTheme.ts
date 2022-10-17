import { extendTheme } from "@chakra-ui/react";
import Button from "./styles/Button";

const dolbyio = extendTheme({
  colors: {
    dolbyPurple: {
      400: "#aa33ff",
    },
  },
  components: {
    Button,
  },
});

export default dolbyio;
