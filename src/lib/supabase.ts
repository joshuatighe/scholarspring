import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** False when the Supabase environment variables are missing (see .env.example). */
export const supabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient<Database> | null =
  url && anonKey ? createClient<Database>(url, anonKey) : null
