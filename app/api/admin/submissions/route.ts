import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';

export interface SubmissionItem {
  id: string;
  ticketCode: string;
  submitterName: string;
  submitterEmail: string;
  relationship: string;
  dogName: string;
  dogBreed: string;
  city: string;
  state: string;
  storyText: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewNotes?: string;
}

let memorySubmissions: SubmissionItem[] = [
  {
    id: 'sub-001',
    ticketCode: 'SUB-2026-0818-4921',
    submitterName: 'Amanda Jenkins',
    submitterEmail: 'amanda.j@example.com',
    relationship: 'Foster Parent & Adopter',
    dogName: 'Cooper',
    dogBreed: 'Golden Retriever Mix',
    city: 'Austin',
    state: 'Texas',
    storyText: 'Cooper was found wandering the highway during a severe winter freeze. After 3 weeks of intensive veterinary care and hypothermia treatment at Austin Pets Alive, he made a complete recovery and now serves as a certified therapy dog for veteran hospital patients.',
    status: 'pending',
    submittedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'sub-002',
    ticketCode: 'SUB-2026-0818-8812',
    submitterName: 'Marcus Vance',
    submitterEmail: 'marcus.v@example.com',
    relationship: 'Search & Rescue Volunteer',
    dogName: 'Echo',
    dogBreed: 'German Shepherd',
    city: 'Boulder',
    state: 'Colorado',
    storyText: 'Echo tracked a lost hiker in the Flatirons mountain pass for 8 hours through sub-zero snowstorm conditions, leading emergency dispatchers directly to the missing hiker who had sustained a sprained ankle.',
    status: 'under_review',
    submittedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
  },
];

export async function GET() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data } = await supabase.from('story_submissions').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        return NextResponse.json({ success: true, submissions: data });
      }
    } catch (e) {
      console.warn('Supabase submissions fetch fallback:', e);
    }
  }

  return NextResponse.json({ success: true, submissions: memorySubmissions });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, reviewNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and Status are required.' }, { status: 400 });
    }

    const sub = memorySubmissions.find((s) => s.id === id || s.ticketCode === id);
    if (sub) {
      sub.status = status;
      if (reviewNotes) sub.reviewNotes = reviewNotes;
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('story_submissions').update({ status, review_notes: reviewNotes }).eq('id', id);
      } catch (e) {
        console.warn('Supabase update note:', e);
      }
    }

    return NextResponse.json({ success: true, message: `Submission updated to ${status}.` });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown submission update error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
