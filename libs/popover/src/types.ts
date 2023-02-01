import { IconButtonProps } from '@chakra-ui/react';
import { PropsWithChildren, ReactElement } from 'react';

export type PopoverProps = PropsWithChildren<{
  heading?: string;
  icon: ReactElement;
  iconProps?: Omit<IconButtonProps, 'aria-label'>;
  label: string;
}>;
