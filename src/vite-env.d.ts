/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COBO_ENV: string
  readonly VITE_COBO_APP_ID: string
  readonly VITE_COBO_APP_SECRET: string
  readonly VITE_COBO_API_KEY: string
  readonly VITE_COBO_API_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}