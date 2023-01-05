import { HStack } from '@chakra-ui/react';
import IconButton from '@millicast-react/icon-button';
import React from 'react';

import { ControlBarProps } from './types';

const ControlBar = ({ controls, ...rest }: ControlBarProps) => {
  return (
    <HStack justifyContent="center" {...rest}>
      {controls.map((element) => {
        if (element) {
          if ('node' in element) {
            return <React.Fragment key={element.key}>{element.node}</React.Fragment>;
          } else {
            const { key, ...rest } = element;
            return <IconButton key={key} {...rest} />;
          }
        }
        return element;
      })}
    </HStack>
  );
};

export * from './types';
export default ControlBar;
