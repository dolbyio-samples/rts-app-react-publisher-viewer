import { Flex, FlexProps } from '@chakra-ui/react';
import * as React from 'react';

export type InfoLabelProps = FlexProps & {
  text: string;
};

const InfoLabel = ({ text, color = 'dolbyPurple.400', bgColor = 'white', ...rest }: InfoLabelProps) => {
  return (
    <Flex
      alignItems="center"
      backdropBlur="4px"
      backdropFilter="auto"
      bgColor={bgColor}
      borderRadius="4px"
      fontSize="12px"
      h="20px"
      lineHeight="16px"
      px="8px"
      py="2px"
      textColor={color}
      {...rest}
    >
      {text}
    </Flex>
  );
};

export default InfoLabel;
