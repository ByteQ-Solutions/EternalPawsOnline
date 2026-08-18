import { NextRequest, NextResponse } from 'next/server';

export interface SiteAnnouncement {
  isActive: boolean;
  message: string;
  badgeText: string;
  actionUrl?: string;
  actionLabel?: string;
  updatedAt: string;
}

let currentAnnouncement: SiteAnnouncement = {
  isActive: true,
  badgeText: '🐾 Sunday Edition',
  message: "New verified survival story: Radar the Island Collie is now live!",
  actionUrl: '/stories/bella-blind-beagle-sanctuary-journey',
  actionLabel: 'Read Story',
  updatedAt: new Date().toISOString(),
};

export async function GET() {
  return NextResponse.json({ success: true, announcement: currentAnnouncement });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    currentAnnouncement = {
      ...currentAnnouncement,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, announcement: currentAnnouncement });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown announcement error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
