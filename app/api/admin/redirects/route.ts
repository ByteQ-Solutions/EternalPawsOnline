import { NextRequest, NextResponse } from 'next/server';

/**
 * 301 Redirect Rules Management API
 * Path: app/api/admin/redirects/route.ts
 * 
 * Features:
 * - List active 301 redirect rules
 * - Add new redirect with loop and circularity detection
 * - Prevent self-referencing rules
 */

interface RedirectEntry {
  id: string;
  fromPath: string;
  toPath: string;
  httpCode: number;
  active: boolean;
  createdAt: string;
}

const inMemoryRedirects: RedirectEntry[] = [
  {
    id: 'red-001',
    fromPath: '/stories/pete-lost-ten-years',
    toPath: '/stories/pete-found-after-ten-years',
    httpCode: 301,
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'red-002',
    fromPath: '/stories/max-mountain-avalanche',
    toPath: '/stories/max-avalanche-search-dog-aspen',
    httpCode: 301,
    active: true,
    createdAt: '2025-02-05T12:00:00Z',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: inMemoryRedirects.length,
    redirects: inMemoryRedirects,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fromPath = body.fromPath?.trim().toLowerCase();
    const toPath = body.toPath?.trim().toLowerCase();

    if (!fromPath || !toPath) {
      return NextResponse.json(
        { success: false, error: 'Both fromPath and toPath are required.' },
        { status: 400 }
      );
    }

    if (fromPath === toPath) {
      return NextResponse.json(
        { success: false, error: 'Self-referencing redirect is invalid.' },
        { status: 400 }
      );
    }

    // Circularity check
    let current: string | undefined = toPath;
    const visited = new Set<string>();
    while (current) {
      if (current === fromPath || visited.has(current)) {
        return NextResponse.json(
          { success: false, error: `Circular redirect chain detected for path: ${current}` },
          { status: 400 }
        );
      }
      visited.add(current);
      const match = inMemoryRedirects.find((r) => r.fromPath === current);
      current = match?.toPath;
    }

    const newRedirect: RedirectEntry = {
      id: `red-${Date.now()}`,
      fromPath,
      toPath,
      httpCode: 301,
      active: true,
      createdAt: new Date().toISOString(),
    };

    inMemoryRedirects.push(newRedirect);

    return NextResponse.json(
      {
        success: true,
        message: 'Redirect rule added successfully.',
        redirect: newRedirect,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: 'Failed to create redirect rule.', details: message },
      { status: 500 }
    );
  }
}
