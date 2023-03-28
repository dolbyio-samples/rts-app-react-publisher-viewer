import { Box, Button, ButtonProps, Switch, Text } from '@chakra-ui/react';
import React from 'react';

type ToggleButtonProps = ButtonProps & {
  label: string;
};

const ToggleButton = ({ leftIcon, label, isActive, ...rest }: ToggleButtonProps) => {
  return (
    <Button
      _active={{ bg: 'dolbyNeutral.800' }}
      _hover={{ bg: 'dolbyNeutral.800' }}
      bg="dolbyNeutral.800"
      border="2px solid"
      borderColor="dolbyNeutral.500"
      leftIcon={
        leftIcon ? (
          <Box color="dolbyNeutral.300" width="24px">
            {leftIcon}
          </Box>
        ) : undefined
      }
      px={3}
      py={5}
      rightIcon={<Switch colorScheme="dolbyEmerald" isChecked={isActive} pointerEvents="none" />}
      w="100%"
      {...rest}
    >
      <Text flex={1} fontSize="14px" fontWeight="500" noOfLines={1} textAlign="left" textOverflow="ellipsis">
        {label}
      </Text>
    </Button>
  );
};

export default ToggleButton;
