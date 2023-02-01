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
      _hover={{
        bg: isActive ? 'dolbyRed.500' : 'dolbyEmerald.600',
      }}
      bg={isActive ? 'dolbyRed.500' : 'dolbyEmerald.600'}
      fontSize="12px"
      isLoading={isLoading}
      onClick={isActive ? stop : start}
      px="4"
      size="sm"
      test-id={isActive ? 'stop-live-indicator' : 'start-live-indicator'}
      textTransform="uppercase"
      {...rest}
    >
      {isActive ? 'STOP' : 'GO LIVE'}
    </Button>
  );
};

export default LiveIndicator;
