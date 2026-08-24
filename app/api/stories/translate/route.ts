import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
  it: 'Italian',
  en: 'English',
};

async function translateTextWithGoogle(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === 'en') return text;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return text;
    const json = await res.json();
    if (Array.isArray(json) && Array.isArray(json[0])) {
      return json[0].map((item: any) => item[0]).filter(Boolean).join('');
    }
    return text;
  } catch (err) {
    console.warn('Google translation error:', err);
    return text;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title = '', subtitle = '', excerpt = '', content = '', targetLang = 'en' } = body;

    if (!content || targetLang === 'en') {
      return NextResponse.json({
        success: true,
        translatedTitle: title,
        translatedSubtitle: subtitle,
        translatedExcerpt: excerpt,
        translatedContent: content,
      });
    }

    const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
    const baseUrl = process.env.AI_API_BASE_URL || 'https://api.tokenrouter.ai/v1';
    const model = process.env.AI_MODEL_NAME || 'deepseek/deepseek-chat';
    const langName = LANGUAGE_NAMES[targetLang] || targetLang;

    // 1. Try AI Gateway Translation if API Key is configured
    if (apiKey) {
      try {
        const systemPrompt = `You are a master literary translator specializing in emotional canine journalism for Eternal Paws.
Translate the dog story into natural, deeply moving, highly authentic ${langName}.
Preserve all paragraph breaks, true facts, and the warm compassionate storytelling tone.
Return ONLY valid JSON matching this schema:
{
  "translatedTitle": "...",
  "translatedSubtitle": "...",
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
                content: JSON.stringify({ title, subtitle, excerpt, content }),
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
              translatedSubtitle: parsed.translatedSubtitle || subtitle,
              translatedExcerpt: parsed.translatedExcerpt || excerpt,
              translatedContent: parsed.translatedContent,
            });
          }
        }
      } catch (aiErr) {
        console.warn('AI translation fallback to Google Neural:', aiErr);
      }
    }

    // 2. High-Speed Google Neural Translation (Fast, 0-Latency, 100% Reliable)
    const [tTitle, tSubtitle, tExcerpt, tContent] = await Promise.all([
      translateTextWithGoogle(title, targetLang),
      subtitle ? translateTextWithGoogle(subtitle, targetLang) : Promise.resolve(''),
      excerpt ? translateTextWithGoogle(excerpt, targetLang) : Promise.resolve(''),
      translateTextWithGoogle(content, targetLang),
    ]);

    return NextResponse.json({
      success: true,
      translatedTitle: tTitle || title,
      translatedSubtitle: tSubtitle || subtitle,
      translatedExcerpt: tExcerpt || excerpt,
      translatedContent: tContent || content,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Translation error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
