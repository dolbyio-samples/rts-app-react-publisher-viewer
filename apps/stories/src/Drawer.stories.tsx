import { Box, Center, ChakraProvider, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { Meta, Story } from '@storybook/react';

import { IconSettings } from '@millicast-react/dolbyio-icons';
import dolbyioTheme from '@millicast-react/dolbyio-theme';
import Drawer, { DrawerProps } from '@millicast-react/drawer';
import IconButton from '@millicast-react/icon-button';

export default {
  component: Drawer,
} as Meta;

export const Default: Story = (args: Omit<DrawerProps, 'isOpen' | 'onClose'>) => {
  const { isOpen, onClose: handleClose, onOpen: handleOpen } = useDisclosure();

  return (
    <ChakraProvider theme={dolbyioTheme}>
      <Center bg="white" height="100%">
        <Box bg="dolbyGrey.500" height="382px" overflow="hidden" position="relative" width="688px">
          <IconButton
            background="transparent"
            bottom="12px"
            icon={<IconSettings />}
            isRound
            onClick={handleOpen}
            position="absolute"
            right="18px"
            reversed
            size="sm"
            testId="drawerOpenButton"
            tooltipProps={{ label: 'Drawer' }}
          />
          <Drawer isOpen={isOpen} onClose={handleClose} {...args} />
        </Box>
      </Center>
    </ChakraProvider>
  );
};

Default.args = {
  children: (
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu sapien id justo condimentum feugiat. Morbi nec
      metus bibendum, venenatis turpis a, venenatis odio. Cras molestie efficitur velit, rhoncus tincidunt leo varius
      et. Suspendisse potenti.
    </p>
  ),
  drawerProps: { color: 'red' },
  fullHeight: true,
  heading: 'Drawer',
  headingProps: { color: 'green' },
};
