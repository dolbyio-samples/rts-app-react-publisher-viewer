import { Browser, BrowserContext, Page, BrowserContextOptions, LaunchOptions } from 'playwright';

export type Screen = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
};

export type GlobalVariables = {
  [key: string]: string | number | boolean;
};

export type BrowserName = 'chrome' | 'chromium' | 'firefox';

export type PlaywrightOptions = {
  browserName: BrowserName;
  timeout?: number;
  headless?: boolean;
  viewport?: { width: number; height: number } | null;
  video?: 'off' | 'on' | 'retain-on-failure';
  screenshot?: 'off' | 'on' | 'only-on-failure';
  trace?: 'off' | 'on' | 'retain-on-failure';
  baseURL?: string;
  publisherURL?: string;
  viewerURL?: string;
  // eslint-disable-next-line no-unused-vars
  launchOptions?: { [K in BrowserName]?: LaunchOptions };
  contextOptions?: BrowserContextOptions;
  reportPath?: string;
};

export type SetupConfig = {
  publisherName: string;
  microphoneOn?: boolean;
  cameraOn?: boolean;
  microphoneName?: string;
  cameraName?: string;
};
