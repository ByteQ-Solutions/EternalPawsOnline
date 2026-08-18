import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSupabase } from '@/lib/db/supabase';
import { removeLiveStory } from '@/lib/data/stories';

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
      removeLiveStory(id);
    }
    if (slug) {
      removeLiveStory(slug);
    }

    const supabase = getSupabase();
    if (supabase) {
      const query = id ? { id } : { slug };
      const { error } = await supabase
        .from('stories')
        .delete()
        .match(query);

      if (error) {
        console.warn('Supabase story delete error:', error.message);
      }
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
