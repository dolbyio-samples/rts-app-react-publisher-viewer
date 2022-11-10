import {
  Box,
  IconButton as ChakraIconButton,
  IconButtonProps as ChakraIconButtonProps,
  Tooltip,
  TooltipProps,
} from '@chakra-ui/react';
import React from 'react';

type IconButtonProps = Omit<ChakraIconButtonProps, 'onClick' | 'aria-label'> & {
  tooltip: Omit<TooltipProps, 'children'> & {
    text: string;
  };
  onClick: ChakraIconButtonProps['onClick'];
  icon: ChakraIconButtonProps['icon'];
};

const IconButton = React.forwardRef<HTMLDivElement, IconButtonProps>(
  ({ tooltip: { text, ...restTooltip }, onClick, icon, ...rest }, ref) => {
    return (
      <Box ref={ref}>
        <Tooltip label={text} borderRadius="6px" fontSize="12px" bgColor="dolbyNeutral.500" {...restTooltip}>
          <ChakraIconButton
            aria-label={text}
            size="lg"
            color="white"
            onClick={onClick}
            backgroundColor="dolbyNeutral.500"
            icon={<Box height="24px">{icon}</Box>}
            _hover={{
              backgroundColor: 'dolbyNeutral.500',
            }}
            _active={{ backgroundColor: 'white', color: 'dolbyPurple.400' }}
            {...rest}
          />
        </Tooltip>
      </Box>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
