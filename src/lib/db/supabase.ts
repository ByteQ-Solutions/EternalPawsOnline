/**
 * Eternal Paws Platform - Supabase Live Client & Database Connection
 * Path: src/lib/db/supabase.ts
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xiyudmicwbmogliiqdxf.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_U8OoSRK4Bvr-kJBpopE36A_kY_cWtg5';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (process.env.NODE_ENV === 'test' && !process.env.TEST_ENABLE_SUPABASE) {
    return null;
  }

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

export const supabase = getSupabase();
