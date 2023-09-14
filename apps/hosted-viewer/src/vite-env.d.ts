/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_RTS_STREAM_NAME: string;
  readonly VITE_RTS_ACCOUNT_ID: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
