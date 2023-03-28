import { rootMain } from '../../../.storybook/main';
import type { StorybookViteConfig } from '@storybook/builder-vite';
import { Options } from '@storybook/core-common';

const config: StorybookViteConfig = {
  ...rootMain,
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [...(rootMain.addons || [])],
  viteFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.ts
    if (rootMain.viteFinal) {
      config = await rootMain.viteFinal(config, { configType } as Options);
    }

    // add your own webpack tweaks if needed

    return config;
  },
};

module.exports = config;
