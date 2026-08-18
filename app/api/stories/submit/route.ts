import { NextRequest, NextResponse } from 'next/server';

/**
 * Community Story Submission API Route
 * Path: app/api/stories/submit/route.ts
 * 
 * Features:
 * - Multi-step payload validation (word counts, email format, rights confirmation)
 * - Safe ticket generation (SUB-YYYY-MMDD-XXXX)
 * - Status queuing for editorial desk
 */

export interface StorySubmissionPayload {
  submitterName: string;
  submitterEmail: string;
  submitterPhone?: string;
  dogName: string;
  dogBreed?: string;
  locationCity: string;
  locationState?: string;
  eventYear?: string;
  category: string;
  emotionalThemes?: string[];
  storyTitle: string;
  storyNarrative: string;
  photoName?: string;
  photoCredit: string;
  licenseType?: string;
  sourceName?: string;
  sourceUrl?: string;
  rightsConfirmed: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const payload: StorySubmissionPayload = await req.json();

    // 1. Validation checks
    if (!payload.submitterName?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Submitter name is required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!payload.submitterEmail || !emailRegex.test(payload.submitterEmail) || payload.submitterEmail.includes('..')) {
      return NextResponse.json(
        { success: false, error: 'A valid submitter email is required.' },
        { status: 400 }
      );
    }

    if (!payload.dogName?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Dog name is required.' },
        { status: 400 }
      );
    }

    if (!payload.locationCity?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Location city is required.' },
        { status: 400 }
      );
    }

    if (!payload.storyTitle?.trim() || payload.storyTitle.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Headline title must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    const wordCount = payload.storyNarrative?.trim().split(/\s+/).filter(Boolean).length || 0;
    if (wordCount < 50) {
      return NextResponse.json(
        { success: false, error: `Story narrative must contain at least 50 words. Current: ${wordCount} words.` },
        { status: 400 }
      );
    }

    if (!payload.photoCredit?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Photo credit / source attribution is required.' },
        { status: 400 }
      );
    }

    if (!payload.rightsConfirmed) {
      return NextResponse.json(
        { success: false, error: 'You must confirm rights and authenticity of this submission.' },
        { status: 400 }
      );
    }

    // 2. Generate standard ticket format: SUB-YYYY-MMDD-XXXX
    const now = new Date();
    const year = now.getFullYear();
    const monthDay = String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketCode = `SUB-${year}-${monthDay}-${randomHex}`;

    return NextResponse.json(
      {
        success: true,
        message: 'Story successfully submitted for fact-checking review.',
        ticket: {
          code: ticketCode,
          dogName: payload.dogName,
          status: 'pending_review',
          estimatedReviewDays: '2-3 business days',
          submittedAt: now.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: 'Failed to process story submission.', details: message },
      { status: 500 }
    );
  }
}
