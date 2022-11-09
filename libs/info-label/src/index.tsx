import { Flex } from '@chakra-ui/react';
import * as React from 'react';

export type InfoLabelProps = {
  text: string;
  color?: string;
  bgColor?: string;
};

const InfoLabel = ({ text, color = 'dolbyPurple.400', bgColor = 'white' }: InfoLabelProps) => {
  return (
    <Flex
      bgColor={bgColor}
      backdropFilter="auto"
      backdropBlur="4px"
      alignItems="center"
      pt="2px"
      pb="2px"
      pl="8px"
      pr="8px"
      h="20px"
      borderRadius="4px"
      fontSize="smaller"
      textColor={color}
    >
      {text}
    </Flex>
  );
};

export default InfoLabel;
