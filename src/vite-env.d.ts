/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_CAST_PLAYER_GLB?: string
  readonly VITE_RIVE_SRC?: string
  readonly VITE_RIVE_STATE_MACHINE?: string
  readonly VITE_RIVE_INPUT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
