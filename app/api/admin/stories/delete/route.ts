import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { StoryService } from '@/lib/services/story-service';

/**
 * Admin Story Delete API Route
 * Path: app/api/admin/stories/delete/route.ts
 */

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, slug } = body;

    if (!id && !slug) {
      return NextResponse.json(
        { success: false, error: 'Story ID or slug is required for deletion.' },
        { status: 400 }
      );
    }

    if (id) {
      await StoryService.removeStory(id);
    }
    if (slug && slug !== id) {
      await StoryService.removeStory(slug);
    }

    try {
      revalidatePath('/');
      revalidatePath('/stories');
      revalidatePath('/rescues');
      revalidatePath('/hero-dogs');
      revalidatePath('/reunions');
      revalidatePath('/survival');
      revalidatePath('/loyalty');
      revalidatePath('/lost-and-found');
      revalidatePath('/search');
      if (slug) revalidatePath(`/stories/${slug}`);
      revalidatePath('/admin');
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: `Story "${slug || id}" successfully deleted.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown delete error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
