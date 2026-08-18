import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';

export interface CorrectionItem {
  id: string;
  ticketCode: string;
  storySlug: string;
  storyTitle: string;
  submitterName: string;
  submitterEmail: string;
  correctionField: string;
  correctionDetails: string;
  sourceUrl?: string;
  status: 'open' | 'in_review' | 'resolved' | 'dismissed';
  createdAt: string;
  resolutionNotes?: string;
}

let memoryCorrections: CorrectionItem[] = [
  {
    id: 'corr-001',
    ticketCode: 'CORR-2026-0818-1092',
    storySlug: 'bella-blind-beagle-sanctuary-journey',
    storyTitle: "Bella's Journey: How a Blind Beagle Guided an Entire Mountain Shelter",
    submitterName: 'Dr. Robert Vance, DVM',
    submitterEmail: 'dr.vance@veterinarycare.org',
    correctionField: 'Dog Age / Shelter Intake Date',
    correctionDetails: 'Bella was officially admitted to Blue Ridge Mountain Sanctuary in November 2021 rather than October 2021 as stated in paragraph 3.',
    sourceUrl: 'https://blueridgehumane.org/archive/bella-record',
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export async function GET() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data } = await supabase.from('correction_requests').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        return NextResponse.json({ success: true, corrections: data });
      }
    } catch (e) {
      console.warn('Supabase corrections fetch fallback:', e);
    }
  }

  return NextResponse.json({ success: true, corrections: memoryCorrections });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, resolutionNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and Status are required.' }, { status: 400 });
    }

    const corr = memoryCorrections.find((c) => c.id === id || c.ticketCode === id);
    if (corr) {
      corr.status = status;
      if (resolutionNotes) corr.resolutionNotes = resolutionNotes;
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('correction_requests').update({ status, resolution_notes: resolutionNotes }).eq('id', id);
      } catch (e) {
        console.warn('Supabase correction update note:', e);
      }
    }

    return NextResponse.json({ success: true, message: `Correction updated to ${status}.` });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown correction update error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
