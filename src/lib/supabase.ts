import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { supabaseAnonKey, supabaseUrl } from './env'

let client: SupabaseClient | undefined

export async function getSupabase(): Promise<SupabaseClient> {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase is not configured.')
  client ??= createClient(supabaseUrl, supabaseAnonKey)
  return client
}
