import { Meta, Story } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import dolbyioTheme from '@millicast-react/dolbyio-theme';
import LiveIndicator from '@millicast-react/live-indicator';
import * as React from 'react';

export default {
  component: LiveIndicator,
} as Meta;

export const Default: Story = () => (
  <ChakraProvider theme={dolbyioTheme}>
    <LiveIndicator />
  </ChakraProvider>
);
