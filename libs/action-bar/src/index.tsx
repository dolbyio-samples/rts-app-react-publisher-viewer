import { Box, Flex, FlexProps, Heading } from '@chakra-ui/react';
import React from 'react';

type ActionBarProps = FlexProps & {
  actionNode?: React.ReactNode;
  title: string;
};

const ActionBar = ({ title, backgroundColor = 'dolbyNeutral.800', actionNode, ...flexProps }: ActionBarProps) => {
  return (
    <Flex
      alignItems="center"
      bgColor={backgroundColor}
      borderRadius="8px"
      h="48px"
      justifyContent="space-between"
      px="4"
      py="2"
      test-id="actionBar"
      w="100%"
      {...flexProps}
    >
      <Heading as="h3" fontSize="16px" fontWeight={600} test-id="headingName">
        {title}
      </Heading>
      <Box>{actionNode}</Box>
    </Flex>
  );
};

export default ActionBar;
