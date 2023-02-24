// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ScenarioData = Map<string, any>;

export type BrowserName = 'chrome' | 'chromium' | 'firefox' | 'edge';

export type TestOptions = {
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
  launchOptions?: { [K in BrowserName]?: Record<string, unknown> };
  browserOptions?: Record<string, unknown>;
  reportPath?: string;
  dynamicStreamName: boolean;
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
  | 'selected'
  | 'unselected'
  | 'unchecked';
export type Status = 'On' | 'Off';
export type Screen = 'Full' | 'Normal';
