// src/types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_SUPABASE_URL: string;
    readonly REACT_APP_API_KEY_SUPABASE: string;
  }
}