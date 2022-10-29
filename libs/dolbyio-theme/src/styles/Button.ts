import { defineStyleConfig } from "@chakra-ui/react";

const Button = defineStyleConfig({
  baseStyle: {
    _loading: {
      _hover: {
        bg: "dolbyPurple.500",
      },
    },
  },
  variants: {
    solid: {
      color: "white",
      _hover: {
        bg: "dolbyPurple.500",
        boxShadow: "0 8px 14px rgba(106, 106, 109, 0.28)",
      },
      _focus: {
        boxShadow: "none",
      },
      bg: "dolbyPurple.400",
    },
    outline: {
      borderColor: "dolbyPurple.400",
    },
  },
});

export default Button;
