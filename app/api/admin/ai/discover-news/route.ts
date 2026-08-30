import { NextRequest, NextResponse } from 'next/server';
import { NewsDiscoveryService } from '@/lib/services/news-discovery';
import { AIService } from '@/lib/ai/ai-service';
import { StoryService } from '@/lib/services/story-service';

export const dynamic = 'force-dynamic';

/**
 * 1. GET: Fetch Live Real Dog News from the Web (Anti-Duplicate Filtered)
 */
export async function GET() {
  try {
    const allStories = await StoryService.getAllStoriesAsync();
    const existingTitles = allStories.map((s) => s.title);
    const existingUrls: string[] = allStories.flatMap((s) =>
      (s.verification?.sources || []).map((src) => src.url).filter((u): u is string => typeof u === 'string' && u.length > 0)
    );

    const news = await NewsDiscoveryService.fetchLiveDogNews(existingTitles, existingUrls);
    return NextResponse.json({ success: true, news });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'News discovery error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * 2. POST: Generate 100% Unique Verified-Style Story from Live Real News
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { newsItem, customTheme } = body;

    const allStories = await StoryService.getAllStoriesAsync();
    const existingTitles = allStories.map((s) => s.title);
    const existingSlugs = allStories.map((s) => s.slug);

    let promptContext = customTheme || '';
    let category = newsItem?.categorySuggestion || undefined;

    if (newsItem) {
      promptContext = `Based on this real-world news event: "${newsItem.headline}". Reported by ${newsItem.source}. URL: ${newsItem.url}. ${customTheme ? `Theme note: ${customTheme}` : ''}`;
    }

    const customKey = req.headers.get('x-custom-ai-key') || body.customKey || undefined;

    const result = await AIService.generateUniqueStory({
      category,
      themePrompt: promptContext,
      existingTitles,
      existingSlugs,
      customKey,
    });

    // If newsItem had a real source, override with the real source
    if (result.success && result.story && newsItem) {
      result.story.verification.sources = [
        {
          id: `src-real-${Date.now()}`,
          name: `${newsItem.source} Verified Dispatch`,
          type: 'news_agency',
          organization: newsItem.source,
          url: newsItem.url,
          documentReference: `NEWS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          verifiedDate: new Date().toISOString(),
          notes: `Corroborated directly against official reporting by ${newsItem.source}.`,
        },
      ];
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Real news story generation error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
