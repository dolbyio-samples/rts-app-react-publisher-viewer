import type { StorybookConfig } from '@storybook/core-common';
import path from 'path';

export const rootMain: StorybookConfig = {
  stories: [],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: async (config, { configType }) => {
    if (config.resolve) {
      config.resolve.alias = {
        '@millicast-react/live-indicator': path.resolve(__dirname, '../libs/live-indicator/src/index.tsx'),
        '@millicast-react/participant-count': path.resolve(__dirname, '../libs/participant-count/src/index.tsx'),
        '@millicast-react/dolbyio-icons': path.resolve(__dirname, '../libs/dolbyio-icons/src/index.ts'),
        '@millicast-react/dolbyio-theme': path.resolve(__dirname, '../libs/dolbyio-theme/src/index.ts'),
      };
    }
    return config;
  },
};
