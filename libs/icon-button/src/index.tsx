import {
  Flex,
  IconButton as ChakraIconButton,
  IconButtonProps as ChakraIconButtonProps,
  Tooltip,
  TooltipProps,
} from '@chakra-ui/react';
import React from 'react';

export type IconButtonProps = Omit<ChakraIconButtonProps, 'onClick' | 'aria-label'> & {
  tooltip: Omit<TooltipProps, 'children'> & {
    label: string;
  };
  onClick?: ChakraIconButtonProps['onClick'];
  icon: ChakraIconButtonProps['icon'];
  reversed?: boolean;
};

const IconButton = ({ tooltip: { label, ...restTooltip }, onClick, icon, reversed, ...rest }: IconButtonProps) => {
  return (
    <Tooltip label={label} {...restTooltip}>
      <ChakraIconButton
        aria-label={label}
        onClick={onClick}
        variant={reversed ? 'iconReversed' : 'icon'}
        icon={
          <Flex boxSize="24px" justifyContent="center" alignItems="center">
            {icon}
          </Flex>
        }
        size="lg"
        {...rest}
      />
    </Tooltip>
  );
};

export default IconButton;
