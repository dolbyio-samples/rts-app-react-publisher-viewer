import { StackProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { IconButtonProps } from '@millicast-react/icon-button';

export interface ControlBarProps extends StackProps {
  controls: Array<ControlButtonProps | ControlElement>;
}

export interface ControlButtonProps extends IconButtonProps {
  key: string;
}

export interface ControlElement {
  node: ReactNode;
  key: string;
}
