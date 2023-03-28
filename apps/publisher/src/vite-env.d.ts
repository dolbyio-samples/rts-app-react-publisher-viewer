/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RTS_STREAM_PUBLISHING_TOKEN: string;
  readonly VITE_RTS_STREAM_NAME: string;
  readonly VITE_RTS_ACCOUNT_ID: string;
  readonly VITE_RTS_VIEWER_BASE_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
