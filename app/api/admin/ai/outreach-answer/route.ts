/**
 * Admin AI Outreach & Backlink Answer Generator API Route
 * Path: app/api/admin/ai/outreach-answer/route.ts
 * 
 * Analyzes Reddit/Quora/Shelter questions, matches the most relevant Eternal Paws
 * asset (Food Safety guide, Wellness protocol, Story, or Calculator), and crafts
 * a natural, helpful, human-voiced response with embedded citation links.
 */

import { NextRequest, NextResponse } from 'next/server';
import { allFoodSafetyItems } from '@/lib/data/food-safety';
import { allWellnessGuides } from '@/lib/data/wellness';
import { StoryService } from '@/lib/services/story-service';
import { AIService } from '@/lib/ai/ai-service';

export interface SiteAsset {
  type: 'tool' | 'food_safety' | 'wellness' | 'story';
  title: string;
  url: string;
  summary: string;
  keywords: string[];
}

// Global Dynamic Site Corpus Catalog
async function getLiveSiteAssetsAsync(): Promise<SiteAsset[]> {
  // Fetch live published stories from Supabase / DB
  const liveStories = await StoryService.getAllStoriesAsync().catch(() => []);
  const publishedStories = liveStories.filter((s) => s.status === 'published');

  return [
    // 1. Interactive Veterinary Tools
    {
      type: 'tool',
      title: 'Dog Chocolate Toxicity Emergency Calculator',
      url: 'https://eternalpaws.online/tools/chocolate-toxicity-calculator',
      summary: 'Clinical calculator calculating exact theobromine mg/kg dose across 7 chocolate types based on dog body weight, with immediate safety rating and ASPCA hotline.',
      keywords: ['chocolate', 'theobromine', 'cacao', 'cocoa', 'hershey', 'bakers chocolate', 'toxicity calculator', 'ate chocolate', 'dog ate chocolate'],
    },
    {
      type: 'tool',
      title: 'Dog Age in Human Years Calculator (by Breed Size)',
      url: 'https://eternalpaws.online/tools/dog-age-calculator',
      summary: 'Calculates equivalent human age using AVMA non-linear biological growth curves for small, medium, large, and giant breeds with senior checklists.',
      keywords: ['dog age', 'human years', 'how old is my dog', 'senior dog age', 'dog age calculator', '7 year rule'],
    },
    // 2. Clinical Wellness Guides
    ...allWellnessGuides.map((g) => ({
      type: 'wellness' as const,
      title: g.title,
      url: `https://eternalpaws.online/wellness/${g.slug}`,
      summary: g.excerpt,
      keywords: [
        g.slug.replace(/-/g, ' '),
        ...g.title.toLowerCase().split(' '),
        ...g.keyTakeaways.map((t) => t.toLowerCase()),
      ],
    })),
    // 3. Food Safety Directory (26+ items)
    ...allFoodSafetyItems.map((f) => ({
      type: 'food_safety' as const,
      title: `Can Dogs Eat ${f.name}? (${f.status.toUpperCase()})`,
      url: `https://eternalpaws.online/can-dogs-eat/${f.slug}`,
      summary: f.quickAnswer,
      keywords: [
        f.name.toLowerCase(),
        f.slug.toLowerCase(),
        `can dogs eat ${f.name.toLowerCase()}`,
        `is ${f.name.toLowerCase()} toxic to dogs`,
        ...f.benefits.map((b) => b.toLowerCase()),
        ...f.risks.map((r) => r.toLowerCase()),
      ],
    })),
    // 4. All Published Live Stories (Auto-updated upon new story creation)
    ...publishedStories.map((s) => ({
      type: 'story' as const,
      title: `${s.dogName}: ${s.title}`,
      url: `https://eternalpaws.online/stories/${s.slug}`,
      summary: s.excerpt,
      keywords: [
        s.dogName.toLowerCase(),
        s.dogBreed.toLowerCase(),
        s.category,
        'rescue story',
        'hero dog',
        'true dog story',
        ...s.title.toLowerCase().split(' '),
        ...s.emotionalThemes.map((t) => t.toLowerCase()),
      ],
    })),
  ];
}

async function findBestMatchingAsset(query: string): Promise<SiteAsset> {
  const assets = await getLiveSiteAssetsAsync();
  const lowerQuery = query.toLowerCase();
  let bestAsset: SiteAsset = assets[0];
  let highestScore = -1;

  for (const asset of assets) {
    let score = 0;

    // Check direct keyword occurrences
    for (const kw of asset.keywords) {
      if (lowerQuery.includes(kw)) {
        score += kw.length > 5 ? 5 : 2;
      }
    }

    // High-priority topic overrides
    if (lowerQuery.includes('chocolate') && asset.url.includes('chocolate-toxicity-calculator')) {
      score += 50;
    }
    if ((lowerQuery.includes('age') || lowerQuery.includes('human years')) && asset.url.includes('dog-age-calculator')) {
      score += 40;
    }
    if ((lowerQuery.includes('lean') || lowerQuery.includes('leaning')) && asset.url.includes('why-does-my-dog-lean-on-me')) {
      score += 40;
    }
    if ((lowerQuery.includes('lick') || lowerQuery.includes('paws')) && asset.url.includes('licking-paws')) {
      score += 40;
    }
    if ((lowerQuery.includes('heat') || lowerQuery.includes('heatstroke')) && asset.url.includes('heatstroke')) {
      score += 40;
    }
    if ((lowerQuery.includes('joint') || lowerQuery.includes('arthritis')) && asset.url.includes('joint-care-arthritis')) {
      score += 40;
    }

    if (score > highestScore) {
      highestScore = score;
      bestAsset = asset;
    }
  }

  return bestAsset;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { question, platform = 'reddit' } = body;

    if (!question || typeof question !== 'string' || question.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid question or forum thread prompt.' },
        { status: 400 }
      );
    }

    // 1. Find the best matching site asset dynamically from live DB
    const matchedAsset = await findBestMatchingAsset(question);

    const customKey = req.headers.get('x-custom-ai-key') || body.customKey || undefined;

    const result = await AIService.generateOutreachAnswer({
      question,
      platform,
      matchedAsset,
      customKey,
    });

    return NextResponse.json({
      success: true,
      matchedAsset,
      platform,
      fullAnswer: result.fullAnswer,
      shortAnswer: result.shortAnswer,
      keyAdvice: result.keyAdvice || '',
      targetKeywords: result.targetKeywords || [],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to generate outreach answer';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
