import { ChakraProvider } from '@chakra-ui/react';
import { Meta, Story } from '@storybook/react';
import * as React from 'react';

import dolbyioTheme from '#millicast-react/dolbyio-theme';
import LiveIndicator from '#millicast-react/live-indicator';

export default {
  component: LiveIndicator,
} as Meta;

export const Default: Story = () => (
  <ChakraProvider theme={dolbyioTheme}>
    <LiveIndicator />
  </ChakraProvider>
);
