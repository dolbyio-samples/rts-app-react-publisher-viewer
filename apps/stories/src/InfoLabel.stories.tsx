import { ChakraProvider, Center } from '@chakra-ui/react';
import { Meta, Story } from '@storybook/react';
import * as React from 'react';

import dolbyioTheme from '#millicast-react/dolbyio-theme';
import InfoLabel from '#millicast-react/info-label';
import type { InfoLabelProps } from '#millicast-react/info-label';

export default {
  component: InfoLabel,
} as Meta;

export const Default: Story = (args: InfoLabelProps) => (
  <ChakraProvider theme={dolbyioTheme}>
    <Center bg="black" h="30px">
      <InfoLabel {...args} />
    </Center>
  </ChakraProvider>
);

Default.args = {
  text: 'Source1 - Desktop',
};

export const GreyLabel: Story = (args: InfoLabelProps) => (
  <ChakraProvider theme={dolbyioTheme}>
    <Center bg="black" h="40px">
      <InfoLabel {...args} />
    </Center>
  </ChakraProvider>
);

GreyLabel.args = {
  color: 'dolbyGrey.500',
  text: 'Presenter',
};

export const LabelWithBlackBackground: Story = (args: InfoLabelProps) => (
  <ChakraProvider theme={dolbyioTheme}>
    <Center bg="whilte" h="40px">
      <InfoLabel {...args} />
    </Center>
  </ChakraProvider>
);

LabelWithBlackBackground.args = {
  bgColor: 'blackAlpha.600',
  color: 'white',
  text: 'Presenter',
};
