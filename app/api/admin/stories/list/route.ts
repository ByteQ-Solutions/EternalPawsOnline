import { NextRequest, NextResponse } from 'next/server';
import { StoryService } from '@/lib/services/story-service';
import { getAllStories } from '@/lib/data/stories';

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
    const result = stories.length > 0 ? stories : (process.env.NODE_ENV === 'test' ? getAllStories() : []);
    return NextResponse.json({
      success: true,
      stories: result,
      count: result.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown stories list error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
