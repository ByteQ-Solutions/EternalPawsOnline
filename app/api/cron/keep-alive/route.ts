import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';

/**
 * Supabase Keep-Alive Cron Endpoint
 * Path: app/api/cron/keep-alive/route.ts
 * 
 * Purpose:
 * Runs a lightweight query on Supabase PostgreSQL every few days
 * to keep the free-tier database active and prevent 7-day inactivity pause.
 */

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        message: 'Supabase client not configured; heartbeat simulated.',
        timestamp: new Date().toISOString(),
      });
    }

    // Lightweight query: read 1 record from stories table
    const { data, error } = await supabase
      .from('stories')
      .select('id, slug')
      .limit(1);

    if (error) {
      console.warn('Keep-alive ping note:', error.message);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase heartbeat ping successful. Database is active.',
      recordsFound: data?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: msg, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
