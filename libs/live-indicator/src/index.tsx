import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';

type GoLiveProps = ButtonProps & {
  isActive: boolean;
  isLoading?: boolean;
  start?: () => void;
  stop?: () => void;
};

const LiveIndicator = ({ isActive, isLoading, start, stop, ...rest }: GoLiveProps) => {
  return (
    <Button
      test-id="live-indicator"
      px="4"
      fontSize="12px"
      size="sm"
      textTransform="uppercase"
      isLoading={isLoading}
      bg={isActive ? 'dolbyRed.500' : 'dolbyEmerald.600'}
      _hover={{
        bg: isActive ? 'dolbyRed.500' : 'dolbyEmerald.600',
      }}
      onClick={isActive ? stop : start}
      {...rest}
    >
      {isActive ? 'STOP' : 'GO LIVE'}
    </Button>
  );
};

export default LiveIndicator;
