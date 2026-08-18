import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';
import { SubmissionService } from '@/lib/services/submission-service';

/**
 * Community Story Submission API Route (Live Supabase + Fallback)
 * Path: app/api/stories/submit/route.ts
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

    // Record submission into unified SubmissionService
    const submission = await SubmissionService.recordSubmission({
      submitterName: payload.submitterName,
      submitterEmail: payload.submitterEmail,
      submitterPhone: payload.submitterPhone,
      dogName: payload.dogName,
      dogBreed: payload.dogBreed,
      locationCity: payload.locationCity,
      locationState: payload.locationState,
      eventYear: payload.eventYear,
      category: payload.category,
      emotionalThemes: payload.emotionalThemes,
      storyTitle: payload.storyTitle,
      storyNarrative: payload.storyNarrative,
      photoName: payload.photoName,
      photoCredit: payload.photoCredit,
      licenseType: payload.licenseType,
      sourceName: payload.sourceName,
      sourceUrl: payload.sourceUrl,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Story successfully submitted for fact-checking review.',
        ticket: {
          code: submission.ticketCode,
          dogName: payload.dogName,
          status: 'pending_review',
          estimatedReviewDays: '2-3 business days',
          submittedAt: submission.submittedAt,
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
