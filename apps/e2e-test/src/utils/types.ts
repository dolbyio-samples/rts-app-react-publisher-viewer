// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ScenarioData = Map<string, any>;

export type BrowserName = 'chrome' | 'chromium' | 'firefox' | 'edge';

export interface TestOptions {
  baseURL?: string;
  browserName: BrowserName;
  browserOptions?: Record<string, unknown>;
  dynamicStreamName: boolean;
  headless?: boolean;
  // eslint-disable-next-line no-unused-vars
  launchOptions?: { [K in BrowserName]?: Record<string, unknown> };
  publisherURL?: string;
  reportPath?: string;
  screenshot?: 'off' | 'on' | 'only-on-failure';
  timeout?: number;
  trace?: 'off' | 'on' | 'retain-on-failure';
  video?: 'off' | 'on' | 'retain-on-failure';
  viewerURL?: string;
  viewport?: { height: number; width: number } | null;
}

export interface SetupConfig {
  cameraName?: string;
  cameraOn?: boolean;
  microphoneName?: string;
  microphoneOn?: boolean;
  publisherName: string;
}

export type State =
  | 'visible'
  | 'hidden'
  | 'enabled'
  | 'disabled'
  | 'displayed'
  | 'invisible'
  | 'editable'
  | 'checked'
  | 'selected'
  | 'unselected'
  | 'unchecked';
export type Status = 'On' | 'Off';
export type Screen = 'Full' | 'Normal';
