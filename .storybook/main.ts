import type { StorybookViteConfig } from '@storybook/builder-vite';
import path from 'path';
import { mergeConfig } from 'vite';

export const rootMain: StorybookViteConfig = {
  stories: [],
  addons: ['@storybook/addon-essentials'],
  core: {
    builder: '@storybook/builder-vite',
  },
  viteFinal: async (config, { configType }) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '#e2e-test/*': ['./apps/e2e-test/*'],
          '#millicast-react/*': ['./libs/*/src/index.ts', './libs/*/src/index.tsx'],
          '#publisher/*': ['./apps/publisher/*'],
          '#tools/*': ['./tools/*'],
          '#viewer/*': ['./apps/viewer/*'],
        },
      },
    });
  },
};
