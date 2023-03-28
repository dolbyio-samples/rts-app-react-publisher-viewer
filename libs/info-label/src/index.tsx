import { Flex, FlexProps } from '@chakra-ui/react';
import * as React from 'react';

export type InfoLabelProps = FlexProps & {
  text: string;
};

const InfoLabel = ({ text, color = 'dolbyPurple.400', bgColor = 'white', ...rest }: InfoLabelProps) => {
  return (
    <Flex
      bgColor={bgColor}
      backdropFilter="auto"
      backdropBlur="4px"
      alignItems="center"
      py="2px"
      px="8px"
      h="20px"
      borderRadius="4px"
      fontSize="12px"
      textColor={color}
      lineHeight="16px"
      {...rest}
    >
      {text}
    </Flex>
  );
};

export default InfoLabel;
