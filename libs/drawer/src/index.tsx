import { Flex, Heading, Slide, Stack } from '@chakra-ui/react';
import React from 'react';

import { IconClose } from '@millicast-react/dolbyio-icons';
import IconButton from '@millicast-react/icon-button';

import { DrawerProps } from './types';

const Drawer = ({
  children,
  drawerProps: { background, bg, ...drawerProps } = {},
  fullHeight,
  heading,
  headingProps = {},
  isOpen,
  onClose: handleDrawerClose,
}: DrawerProps) => {
  const drawerBackground = background ?? bg ?? 'dolbyNeutral.800';

  return (
    <Slide in={isOpen} style={{ position: 'absolute' }} unmountOnExit>
      <Flex
        bg={drawerBackground}
        borderRadius="6px"
        bottom={0}
        color="white"
        flexDir="column"
        height={fullHeight ? '100%' : ''}
        position="absolute"
        right="0"
        width="346px"
        padding="24px 16px 48px"
        {...drawerProps}
      >
        <Heading as="h3" fontSize="20px" fontWeight={600} mb="16px" {...headingProps}>
          {heading}
        </Heading>
        <IconButton
          background="transparent"
          borderRadius="50%"
          icon={<IconClose fill="white" height="16px" width="16px" />}
          isRound
          onClick={handleDrawerClose}
          position="absolute"
          right="12px"
          size="sm"
          test-id="drawerCloseButton"
          top="8px"
        />
        <Stack direction="column" height="100%" spacing={4} sx={{ '&>*': { bg: drawerBackground } }}>
          {children}
        </Stack>
      </Flex>
    </Slide>
  );
};

export * from './types';
export default Drawer;
