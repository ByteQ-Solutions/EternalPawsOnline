import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { StoryService } from '@/lib/services/story-service';

/**
 * Admin Story Feature / Hero Spotlight Toggle API Route
 * Path: app/api/admin/stories/feature/route.ts
 */

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, slug, featured } = body;

    if (!id && !slug) {
      return NextResponse.json(
        { success: false, error: 'Story ID or Slug is required.' },
        { status: 400 }
      );
    }

    const target = id || slug;
    const updatedStory = await StoryService.toggleFeatured(target, featured);

    if (!updatedStory) {
      return NextResponse.json(
        { success: false, error: 'Story not found in repository.' },
        { status: 404 }
      );
    }

    // Invalidate Next.js cache so the homepage hero updates immediately
    try {
      revalidatePath('/');
      revalidatePath('/stories');
      revalidatePath(`/${updatedStory.category}`);
      revalidatePath(`/stories/${updatedStory.slug}`);
      revalidatePath('/admin');
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: `Story "${updatedStory.title}" is now ${updatedStory.featured ? 'FEATURED as Homepage Hero' : 'unpinned'}.`,
      story: updatedStory,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown feature toggle error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
