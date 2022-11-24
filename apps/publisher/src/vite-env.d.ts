/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MILLICAST_STREAM_PUBLISHING_TOKEN: string;
  readonly VITE_MILLICAST_STREAM_NAME: string;
  readonly VITE_MILLICAST_STREAM_ID: string;
  readonly VITE_MILLICAST_VIEWER_BASE_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
