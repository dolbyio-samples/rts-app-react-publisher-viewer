import dotenv from 'dotenv';
import { BrowserContextOptions, LaunchOptions } from 'playwright';

import { defaultReportPath } from './config/defaults';
import { BrowserName, PlaywrightOptions } from './utils/type';

dotenv.config({ path: '.test.env' });

export const launchOptionsChromium: LaunchOptions = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
  ],
};

export const launchOptionsChrome: LaunchOptions = {
  channel: 'chrome',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
  ],
};

export const launchOptionsFirefox: LaunchOptions = {
  args: ['--quiet', '--use-test-media-devices'],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
};

export const browserContextOptions: BrowserContextOptions = {};

export const options: PlaywrightOptions = {
  browserName: (process.env.BROWSER_NAME as BrowserName) || 'chrome',
  headless: process.env.HEADLESS?.toLowerCase() === 'true' || true,
  timeout: 60 * 1000,
  viewport: { width: 1280, height: 1024 },
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
  trace: 'retain-on-failure',
  baseURL: 'http://localhost:5173',
  publisherURL: process.env.PUBLISHER_URL || 'http://localhost:5173/',
  viewerURL: process.env.VIEWER_URL || 'http://localhost:5174/',
  launchOptions: {
    chromium: launchOptionsChromium,
    chrome: launchOptionsChrome,
    firefox: launchOptionsFirefox,
  },
  contextOptions: browserContextOptions,
  reportPath: process.env.REPORT_PATH || defaultReportPath,
};
