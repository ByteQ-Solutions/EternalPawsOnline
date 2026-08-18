import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/ai-service';

/**
 * Admin AI Story Generator API Endpoint
 * Path: app/api/admin/ai/generate/route.ts
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, dogName, dogBreed, location, category } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please provide a topic, brief summary, or news link to generate a story.' },
        { status: 400 }
      );
    }

    const result = await AIService.generateDraft({
      topic,
      dogName,
      dogBreed,
      location,
      category,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown AI error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
