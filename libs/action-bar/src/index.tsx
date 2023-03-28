import { Box, Flex, FlexProps, Heading } from '@chakra-ui/react';
import React from 'react';

type ActionBarProps = FlexProps & {
  title: string;
  actionNode?: React.ReactNode;
};

const ActionBar = ({ title, backgroundColor = 'dolbyNeutral.800', actionNode, ...flexProps }: ActionBarProps) => {
  return (
    <Flex
      test-id="actionBar"
      bgColor={backgroundColor}
      alignItems="center"
      justifyContent="space-between"
      borderRadius="8px"
      w="100%"
      py="2"
      px="4"
      h="48px"
      {...flexProps}
    >
      <Heading test-id="headingName" as="h3" fontSize="16px" fontWeight={600}>
        {title}
      </Heading>
      <Box>{actionNode}</Box>
    </Flex>
  );
};

export default ActionBar;
