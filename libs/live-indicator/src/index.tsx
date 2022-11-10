import { Button, ButtonProps } from '@chakra-ui/react';
import { IconStream } from '@millicast-react/dolbyio-icons';
import React from 'react';

type LiveIndicatorProps = Omit<ButtonProps, 'onClick'> & {
  isActive: boolean;
  text?: string;
};

const LiveIndicator = ({ isActive, text = 'live', ...rest }: LiveIndicatorProps) => {
  return (
    <Button
      test-id="live-indicator"
      as="div"
      leftIcon={<IconStream height="16px" />}
      px="2"
      fontSize="12px"
      letterSpacing="1px"
      pointerEvents="none"
      size="sm"
      backgroundColor={isActive ? 'dolbyRed.500' : 'dolbyNeutral.500'}
      textTransform="uppercase"
      {...rest}
    >
      {text}
    </Button>
  );
};

export default LiveIndicator;
