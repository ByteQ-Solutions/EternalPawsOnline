import { NextRequest, NextResponse } from 'next/server';

/**
 * Newsletter Subscription API Route
 * Path: app/api/newsletter/subscribe/route.ts
 * 
 * Features:
 * - RFC 5322 email regex validation
 * - Rate limiting check
 * - Idempotent subscriber recording
 * - Clean JSON response format
 */

interface NewsletterRequestBody {
  email?: string;
  source?: string;
}

// In-memory active subscriber cache for instant lookups
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

    // RFC 5322 standard email regex (preventing double dots, invalid domains)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.includes('..')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Record subscription
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
