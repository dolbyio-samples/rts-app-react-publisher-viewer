import { BrowserContextOptions, LaunchOptions } from 'playwright';

export type GlobalVariables = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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

export type State =
  | 'visible'
  | 'hidden'
  | 'enabled'
  | 'disabled'
  | 'displayed'
  | 'invisible'
  | 'editable'
  | 'checked'
  | 'selected';
export type Status = 'On' | 'Off';
export type Screen = 'Full' | 'Normal';
