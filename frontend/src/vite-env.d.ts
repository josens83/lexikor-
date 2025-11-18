/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
