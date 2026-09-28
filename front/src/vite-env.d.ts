/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Voir .env.example.
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
