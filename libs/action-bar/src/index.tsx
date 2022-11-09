import { Box, Flex, FlexProps, Heading } from '@chakra-ui/react';
import React from 'react';

type ActionBarProps = FlexProps & {
  name: string;
  action: React.ReactNode;
};

const ActionBar = ({ name, backgroundColor = 'dolbyNeutral.800', action, ...flexProps }: ActionBarProps) => {
  return (
    <Flex
      bgColor={backgroundColor}
      alignItems="center"
      justifyContent="space-between"
      borderRadius="8px"
      w="100%"
      py="2.5"
      px="4"
      {...flexProps}
    >
      <Heading as="h3" fontSize="16px" fontWeight={600}>
        {name}
      </Heading>
      <Box>{action}</Box>
    </Flex>
  );
};

export default ActionBar;
