import { Meta, Story } from '@storybook/react';
import { ChakraProvider, Center } from '@chakra-ui/react';
import dolbyioTheme from '@millicast-react/dolbyio-theme';
import InfoLabel from '@millicast-react/info-label';
import type { InfoLabelProps } from '@millicast-react/info-label';
import * as React from 'react';

export default {
  component: InfoLabel,
} as Meta;

export const Default: Story = (args: InfoLabelProps) => (
  <ChakraProvider theme={dolbyioTheme}>
    <Center h="30px" bg="black">
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
  text: 'Presenter',
  color: 'dolbyGrey.500',
};

export const LabelWithBlackBackground: Story = (args: InfoLabelProps) => (
  <ChakraProvider theme={dolbyioTheme}>
    <Center bg="whilte" h="40px">
      <InfoLabel {...args} />
    </Center>
  </ChakraProvider>
);

LabelWithBlackBackground.args = {
  text: 'Presenter',
  color: 'white',
  bgColor: 'blackAlpha.600',
};
