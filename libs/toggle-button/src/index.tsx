import { Box, Button, ButtonProps, Switch, Text } from '@chakra-ui/react';
import React from 'react';

type ToggleButtonProps = ButtonProps & {
  label: string;
};

const ToggleButton = ({ leftIcon, label, isActive, ...rest }: ToggleButtonProps) => {
  return (
    <Button
      w="100%"
      border="2px solid"
      borderColor="dolbyNeutral.500"
      bg="dolbyNeutral.800"
      px={3}
      py={5}
      _active={{ bg: 'dolbyNeutral.800' }}
      _hover={{ bg: 'dolbyNeutral.800' }}
      leftIcon={
        leftIcon ? (
          <Box width="24px" color="dolbyNeutral.300">
            {leftIcon}
          </Box>
        ) : undefined
      }
      rightIcon={<Switch colorScheme="dolbyEmerald" isChecked={isActive} pointerEvents="none" />}
      {...rest}
    >
      <Text flex={1} noOfLines={1} textOverflow="ellipsis" fontSize="14px" fontWeight="500" textAlign="left">
        {label}
      </Text>
    </Button>
  );
};

export default ToggleButton;
