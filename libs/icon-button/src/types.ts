import { IconButtonProps as ChakraIconButtonProps, TooltipProps } from '@chakra-ui/react';

export interface IconButtonProps extends Omit<ChakraIconButtonProps, 'aria-label'> {
  'aria-label'?: string;
  reversed?: boolean;
  testId: string;
  tooltipProps?: Omit<TooltipProps, 'children'> & {
    label: string;
  };
}
