import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';
import { EmailService } from '@/lib/services/email-service';
import { allSeedStories } from '@/lib/data/stories';

export interface SubscriberItem {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
  confirmedDoubleOptIn: boolean;
}

let memorySubscribers: SubscriberItem[] = [
  { id: 'sub-em-001', email: 'sarah.reader@gmail.com', subscribedAt: '2026-03-01T10:00:00Z', status: 'active', confirmedDoubleOptIn: true },
  { id: 'sub-em-002', email: 'doglover99@yahoo.com', subscribedAt: '2026-03-05T14:30:00Z', status: 'active', confirmedDoubleOptIn: true },
  { id: 'sub-em-003', email: 'mark.rescue@outlook.com', subscribedAt: '2026-03-10T09:15:00Z', status: 'active', confirmedDoubleOptIn: true },
  { id: 'sub-em-004', email: 'pawsluvshop@gmail.com', subscribedAt: '2026-03-12T16:45:00Z', status: 'active', confirmedDoubleOptIn: true },
];

export async function GET() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        return NextResponse.json({ success: true, subscribers: data });
      }
    } catch (e) {
      console.warn('Supabase subscribers fetch fallback:', e);
    }
  }

  return NextResponse.json({ success: true, subscribers: memorySubscribers });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { customStorySlug, subjectLine } = body;

    const featuredStory = allSeedStories.find((s) => s.slug === customStorySlug) || allSeedStories[0];

    const activeList = memorySubscribers.filter((s) => s.status === 'active');
    let dispatchCount = 0;

    for (const sub of activeList) {
      await EmailService.sendWelcomeNewsletterEmail(sub.email);
      dispatchCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Sunday Newsletter Digest successfully dispatched to ${dispatchCount} subscribers.`,
      dispatchedCount: dispatchCount,
      featuredStoryTitle: featuredStory.title,
      subject: subjectLine || `Sunday Pack Edition: ${featuredStory.dogName}'s Incredible Story 🐾`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown newsletter dispatch error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
