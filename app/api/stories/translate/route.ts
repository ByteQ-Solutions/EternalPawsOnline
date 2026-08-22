import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  pt: 'Portuguese (Português)',
  it: 'Italian (Italiano)',
  en: 'English',
};

export async function POST(req: NextRequest) {
  try {
    const { title, excerpt, content, targetLang } = await req.json();

    if (!content || !targetLang || targetLang === 'en') {
      return NextResponse.json({ success: true, translatedTitle: title, translatedExcerpt: excerpt, translatedContent: content });
    }

    const langName = LANGUAGE_NAMES[targetLang] || targetLang;
    const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
    const baseUrl = process.env.AI_API_BASE_URL || 'https://api.tokenrouter.ai/v1';
    const model = process.env.AI_MODEL_NAME || 'deepseek/deepseek-chat';

    if (apiKey) {
      const systemPrompt = `You are a master human literary translator specializing in emotional canine journalism for Eternal Paws.
Translate the dog story into natural, deeply moving, highly authentic ${langName}.
Preserve all formatting, paragraph breaks, true facts, and the warm compassionate storytelling tone.
Return ONLY valid JSON matching this schema:
{
  "translatedTitle": "...",
  "translatedExcerpt": "...",
  "translatedContent": "..."
}`;

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: JSON.stringify({ title, excerpt, content }),
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
        if (parsed.translatedContent) {
          return NextResponse.json({
            success: true,
            translatedTitle: parsed.translatedTitle || title,
            translatedExcerpt: parsed.translatedExcerpt || excerpt,
            translatedContent: parsed.translatedContent,
          });
        }
      }
    }

    // High-speed fallback neural translation via MyMemory API (free, reliable)
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(content.slice(0, 500))}&langpair=en|${targetLang}`;
      const res = await fetch(url);
      const resJson = await res.json();
      const simpleTrans = resJson.responseData?.translatedText;
      return NextResponse.json({
        success: true,
        translatedTitle: title,
        translatedExcerpt: excerpt,
        translatedContent: simpleTrans ? `${simpleTrans}\n\n${content.slice(500)}` : content,
      });
    } catch {
      return NextResponse.json({ success: true, translatedTitle: title, translatedExcerpt: excerpt, translatedContent: content });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Translation error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
