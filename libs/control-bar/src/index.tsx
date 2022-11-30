import { HStack, StackProps } from '@chakra-ui/react';
import IconButton, { IconButtonProps } from '@millicast-react/icon-button';
import React, { ReactNode } from 'react';

type ControlButtonProps = IconButtonProps & {
  key: string;
  ['test-id']?: string;
};

type ControlElement = {
  key: string;
  node: ReactNode;
};

type ControlBarProps = StackProps & {
  controls: Array<ControlElement | ControlButtonProps>;
};

const ControlBar = ({ controls, ...rest }: ControlBarProps) => {
  return (
    <HStack justifyContent="center" {...rest}>
      {controls.map((element) => {
        if ('node' in element) {
          return <React.Fragment key={element.key}>{element.node}</React.Fragment>;
        } else {
          const { key, ...rest } = element;
          return <IconButton key={key} {...rest} />;
        }
      })}
    </HStack>
  );
};

export default ControlBar;
