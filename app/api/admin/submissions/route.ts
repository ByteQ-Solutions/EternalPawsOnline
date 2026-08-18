import { NextRequest, NextResponse } from 'next/server';
import { SubmissionService, CommunitySubmission } from '@/lib/services/submission-service';

export async function GET() {
  const submissions = await SubmissionService.getAllSubmissions();
  return NextResponse.json({ success: true, submissions });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, reviewNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and Status are required.' }, { status: 400 });
    }

    await SubmissionService.updateStatus(id, status, reviewNotes);
    return NextResponse.json({ success: true, message: `Submission updated to ${status}.` });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown submission update error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
