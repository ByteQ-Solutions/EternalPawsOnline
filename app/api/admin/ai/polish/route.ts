import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/ai-service';

/**
 * Admin AI Story Polisher API Endpoint
 * Path: app/api/admin/ai/polish/route.ts
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, dogName } = body;

    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please provide at least 10 characters of story narrative to polish.' },
        { status: 400 }
      );
    }

    const customKey = req.headers.get('x-custom-ai-key') || body.customKey || undefined;
    const result = await AIService.polishStory(text, dogName, customKey);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown AI error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
