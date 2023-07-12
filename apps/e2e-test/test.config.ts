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
  channel: 'chrome',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
  ],
};

export const launchOptionsEdge = {
  channel: 'edge',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
  ],
};

export const launchOptionsFirefox = {
  args: ['--quiet', '--use-test-media-devices'],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
};

export const browserOptions = {
  permissions: ['clipboard-read'],
};

export const options: TestOptions = {
  browserName: (process.env.BROWSER_NAME as BrowserName) || 'chrome',
  headless: process.env.HEADLESS?.toLowerCase() === 'true' || true,
  timeout: 90 * 1000,
  viewport: { width: 1280, height: 1024 },
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
  trace: 'retain-on-failure',
  baseURL: 'http://localhost:4174',
  publisherURL: process.env.PUBLISHER_URL || 'http://localhost:4174/',
  viewerURL: process.env.VIEWER_URL || 'http://localhost:4173/',
  launchOptions: {
    chromium: launchOptionsChromium,
    chrome: launchOptionsChrome,
    firefox: launchOptionsFirefox,
    edge: launchOptionsEdge,
  },
  browserOptions: browserOptions,
  reportPath: process.env.REPORT_PATH || defaultReportPath,
  dynamicStreamName: process.env.DYNAMIC_STREAM_NAME?.toLowerCase() === 'true',
};
