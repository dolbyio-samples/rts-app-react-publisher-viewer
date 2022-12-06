import type { StorybookViteConfig } from '@storybook/builder-vite';
import { mergeConfig } from 'vite';
import path from 'path';

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
          '@millicast-react/info-label': path.resolve(__dirname, '../libs/info-label/src/index.tsx'),
          '@millicast-react/live-indicator': path.resolve(__dirname, '../libs/live-indicator/src/index.tsx'),
          '@millicast-react/participant-count': path.resolve(__dirname, '../libs/participant-count/src/index.tsx'),
          '@millicast-react/dolbyio-icons': path.resolve(__dirname, '../libs/dolbyio-icons/src/index.ts'),
          '@millicast-react/dolbyio-theme': path.resolve(__dirname, '../libs/dolbyio-theme/src/index.ts'),
          '@millicast-react/use-local-files': path.resolve(__dirname, '../libs/use-local-files/src/index.ts'),
          '@millicast-react/video-view': path.resolve(__dirname, '../libs/video-view/src/index.tsx'),
        },
      },
    });
  },
};
