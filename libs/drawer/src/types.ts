import { FlexProps, HeadingProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface DrawerProps {
  children: ReactNode;
  drawerProps?: FlexProps;
  fullHeight?: boolean;
  heading: string;
  headingProps?: HeadingProps;
  isOpen: boolean;
  onClose: () => void;
}
