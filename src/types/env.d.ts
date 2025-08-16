/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_VERSION: string
  readonly VITE_SECRET_KEY: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_ENABLE_REDUX_DEVTOOLS: string
  readonly VITE_ENABLE_LOGGING: string
  readonly VITE_APP_TITLE: string
  readonly VITE_ENABLE_SERVICE_WORKER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
