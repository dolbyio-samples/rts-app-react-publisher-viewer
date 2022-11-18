import { HStack, StackProps } from '@chakra-ui/react';
import IconButton, { IconButtonProps } from '@millicast-react/icon-button';
import React from 'react';

type ControlButtonProps = IconButtonProps & {
  key: string;
  ['test-id']?: string;
};

type ControlBarProps = StackProps & {
  controls: ControlButtonProps[];
};

const ControlBar = ({ controls, ...rest }: ControlBarProps) => {
  return (
    <HStack justifyContent="center" {...rest}>
      {controls.map(({ key, ...rest }) => (
        <IconButton key={key} {...rest} />
      ))}
    </HStack>
  );
};

export default ControlBar;
