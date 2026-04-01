import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const fallbackSupabaseUrl = import.meta.env.SYSTEMBOLAGET_VITE_PUBLIC_SUPABASE_URL;
const fallbackSupabaseAnonKey =
  import.meta.env.SYSTEMBOLAGET_VITE_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.SYSTEMBOLAGET_VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const resolvedSupabaseUrl = supabaseUrl || fallbackSupabaseUrl;
const resolvedSupabaseAnonKey = supabaseAnonKey || fallbackSupabaseAnonKey;

if (!resolvedSupabaseUrl || !resolvedSupabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY).');
}

export const supabase =
  resolvedSupabaseUrl && resolvedSupabaseAnonKey
    ? createClient(resolvedSupabaseUrl, resolvedSupabaseAnonKey)
    : null;

export default supabase;
