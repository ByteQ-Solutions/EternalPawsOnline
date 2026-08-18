import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';

/**
 * Newsletter Subscription API Route (Live Supabase + Fallback)
 * Path: app/api/newsletter/subscribe/route.ts
 */

interface NewsletterRequestBody {
  email?: string;
  source?: string;
}

const inMemorySubscribers = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body: NewsletterRequestBody = await req.json();
    const email = body.email?.trim().toLowerCase();
    const source = body.source || 'web_footer';

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.includes('..')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Try Supabase insertion if available
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error: insertError } = await supabase
          .from('newsletter_subscribers')
          .insert({
            email,
            source_channel: source,
            status: 'active',
            subscribed_at: new Date().toISOString(),
          });

        if (insertError && !insertError.message?.includes('duplicate')) {
          console.warn('Supabase newsletter insert note:', insertError.message);
        }
      } catch (dbErr) {
        console.warn('Database offline, using memory cache:', dbErr);
      }
    }

    const isNew = !inMemorySubscribers.has(email);
    inMemorySubscribers.add(email);

    return NextResponse.json(
      {
        success: true,
        message: isNew
          ? "Welcome to the pack! You're subscribed for Sunday stories."
          : 'You are already subscribed to Eternal Paws!',
        subscriber: {
          email,
          source,
          subscribedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: 'Unable to process subscription. Please try again.', details: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Eternal Paws Newsletter API',
    status: 'operational',
    frequency: 'weekly_sunday',
  });
}
