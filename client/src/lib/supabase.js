import { createClient } from '@supabase/supabase-js'

const defaultSupabaseUrl = 'https://jthchzbfhtkqcruhxfcg.supabase.co'
const defaultSupabaseAnonKey = 'sb_publishable_nILWIHwnTg0Wu7uaCu6NmA_ol-11awB'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultSupabaseUrl
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultSupabaseAnonKey

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
