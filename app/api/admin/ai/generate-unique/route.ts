import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/ai-service';
import { allSeedStories } from '@/lib/data/stories';
import { getSupabase } from '@/lib/db/supabase';

/**
 * Admin AI Unique Story Generator API Route
 * Path: app/api/admin/ai/generate-unique/route.ts
 * 
 * Enforces anti-duplication collision check against Supabase & local seed corpus.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { category, themePrompt } = body;

    // Collect all existing story titles and slugs to prevent duplicates
    const existingTitles = allSeedStories.map((s) => s.title);
    const existingSlugs = allSeedStories.map((s) => s.slug);

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: dbStories } = await supabase
          .from('stories')
          .select('title, slug');
        if (dbStories && dbStories.length > 0) {
          dbStories.forEach((s) => {
            if (s.title && !existingTitles.includes(s.title)) existingTitles.push(s.title);
            if (s.slug && !existingSlugs.includes(s.slug)) existingSlugs.push(s.slug);
          });
        }
      } catch (err) {
        console.warn('Could not fetch existing DB titles for collision check:', err);
      }
    }

    const customKey = req.headers.get('x-custom-ai-key') || body.customKey || undefined;

    const result = await AIService.generateUniqueStory({
      category,
      themePrompt,
      existingTitles,
      existingSlugs,
      customKey,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown AI generation error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
