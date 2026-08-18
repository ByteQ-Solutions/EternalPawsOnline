import { NextRequest, NextResponse } from 'next/server';

/**
 * Correction / Retraction Request Submission API Route
 * Path: app/api/corrections/submit/route.ts
 * 
 * Features:
 * - Reader correction intake validation
 * - Ticket generation (CORR-YYYY-MMDD-XXXX)
 * - Structured issue categorization
 */

export interface CorrectionPayload {
  storySlug: string;
  storyTitle: string;
  submitterName: string;
  submitterEmail: string;
  issueType: string;
  correctionDetails: string;
  supportingLinks?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const payload: CorrectionPayload = await req.json();

    if (!payload.storySlug?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Story slug is required.' },
        { status: 400 }
      );
    }

    if (!payload.submitterName?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Your name is required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!payload.submitterEmail || !emailRegex.test(payload.submitterEmail) || payload.submitterEmail.includes('..')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!payload.issueType?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please specify the type of correction requested.' },
        { status: 400 }
      );
    }

    const detailsLength = payload.correctionDetails?.trim().length || 0;
    if (detailsLength < 20) {
      return NextResponse.json(
        { success: false, error: `Correction details must be at least 20 characters. Current: ${detailsLength} chars.` },
        { status: 400 }
      );
    }

    if (detailsLength > 3000) {
      return NextResponse.json(
        { success: false, error: 'Correction details exceed 3,000 characters limit.' },
        { status: 400 }
      );
    }

    // Generate standard ticket: CORR-YYYY-MMDD-XXXX
    const now = new Date();
    const year = now.getFullYear();
    const monthDay = String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketCode = `CORR-${year}-${monthDay}-${randomHex}`;

    return NextResponse.json(
      {
        success: true,
        message: 'Correction request submitted to editorial desk.',
        ticket: {
          code: ticketCode,
          storySlug: payload.storySlug,
          issueType: payload.issueType,
          status: 'open',
          submittedAt: now.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: 'Failed to process correction request.', details: message },
      { status: 500 }
    );
  }
}
