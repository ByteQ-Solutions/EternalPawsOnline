import { NextRequest, NextResponse } from 'next/server';
import { StoryService } from '@/lib/services/story-service';

/**
 * Admin Stories List API Route
 * Path: app/api/admin/stories/list/route.ts
 * 
 * Fetches all published & draft stories from Supabase with fallback to active live corpus.
 */

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const stories = await StoryService.getAllStoriesAsync();
    return NextResponse.json({
      success: true,
      stories,
      count: stories.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown stories list error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
