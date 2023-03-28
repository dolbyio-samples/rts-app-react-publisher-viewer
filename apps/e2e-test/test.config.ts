import dotenv from 'dotenv';

import { defaultReportPath } from './src/config/defaults';
import { BrowserName, TestOptions } from './src/utils/types';

dotenv.config({ path: '.test.env' });

export const launchOptionsChromium = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
  ],
};

export const launchOptionsChrome = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
  ],
  channel: 'chrome',
};

export const launchOptionsEdge = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
  ],
  channel: 'edge',
};

export const launchOptionsFirefox = {
  args: ['--quiet', '--use-test-media-devices'],
  firefoxUserPrefs: {
    'media.navigator.permission.disabled': true,
    'media.navigator.streams.fake': true,
  },
};

export const browserOptions = {};

export const options: TestOptions = {
  baseURL: 'http://localhost:4174',
  browserName: (process.env.BROWSER_NAME as BrowserName) || 'chrome',
  browserOptions: browserOptions,
  dynamicStreamName: process.env.DYNAMIC_STREAM_NAME?.toLowerCase() === 'true',
  headless: process.env.HEADLESS?.toLowerCase() === 'true' || true,
  launchOptions: {
    chrome: launchOptionsChrome,
    chromium: launchOptionsChromium,
    edge: launchOptionsEdge,
    firefox: launchOptionsFirefox,
  },
  publisherURL: process.env.PUBLISHER_URL || 'http://localhost:4174/',
  reportPath: process.env.REPORT_PATH || defaultReportPath,
  screenshot: 'only-on-failure',
  timeout: 90 * 1000,
  trace: 'retain-on-failure',
  video: 'retain-on-failure',
  viewerURL: process.env.VIEWER_URL || 'http://localhost:4173/',
  viewport: { height: 1024, width: 1280 },
};
