import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[FitLog] Supabase env vars are missing. Copy .env.example to .env.local and fill in your project credentials.',
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '')
