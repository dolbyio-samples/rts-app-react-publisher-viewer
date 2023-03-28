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
          '@millicast-react/control-bar': path.resolve(__dirname, '../libs/control-bar/src/index.tsx'),
          '@millicast-react/device-selection-modal': path.resolve(
            __dirname,
            '../libs/device-selection-modal/src/index.ts'
          ),
          '@millicast-react/dolbyio-icons': path.resolve(__dirname, '../libs/dolbyio-icons/src/index.ts'),
          '@millicast-react/dolbyio-theme': path.resolve(__dirname, '../libs/dolbyio-theme/src/index.ts'),
          '@millicast-react/drawer': path.resolve(__dirname, '../libs/drawer/src/index.tsx'),
          '@millicast-react/dropdown': path.resolve(__dirname, '../libs/dropdown/src/index.tsx'),
          '@millicast-react/icon-button': path.resolve(__dirname, '../libs/icon-button/src/index.tsx'),
          '@millicast-react/info-label': path.resolve(__dirname, '../libs/info-label/src/index.tsx'),
          '@millicast-react/input': path.resolve(__dirname, '../libs/input/src/index.tsx'),
          '@millicast-react/live-indicator': path.resolve(__dirname, '../libs/live-indicator/src/index.tsx'),
          '@millicast-react/participant-count': path.resolve(__dirname, '../libs/participant-count/src/index.tsx'),
          '@millicast-react/tabs': path.resolve(__dirname, '../libs/tabs/src/index.tsx'),
          '@millicast-react/toggle-button': path.resolve(__dirname, '../libs/toggle-button/src/index.tsx'),
          '@millicast-react/use-media-devices': path.resolve(__dirname, '../libs/use-media-devices/src/index.ts'),
          '@millicast-react/use-local-files': path.resolve(__dirname, '../libs/use-local-files/src/index.ts'),
          '@millicast-react/use-screen-share': path.resolve(__dirname, '../libs/use-screen-share/src/index.ts'),
          '@millicast-react/video-view': path.resolve(__dirname, '../libs/video-view/src/index.tsx'),
        },
      },
    });
  },
};
