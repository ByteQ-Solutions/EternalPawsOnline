/**
 * Admin Story CRUD Operations Integration & API Unit Tests
 * Path: tests/api/story-crud.test.ts
 */

import { describe, it, expect } from 'vitest';
import { GET as listStoriesHandler } from '@/app/api/admin/stories/list/route';
import { PUT as updateStoryHandler } from '@/app/api/admin/stories/update/route';
import { DELETE as deleteStoryHandler } from '@/app/api/admin/stories/delete/route';
import { NextRequest } from 'next/server';

function createMockRequest(body: unknown, method: string = 'POST'): NextRequest {
  return new NextRequest(new URL('http://localhost:3000/api/admin/stories/test'), {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('Admin Story Management CRUD API Suite', () => {
  describe('1. Stories List API (/api/admin/stories/list)', () => {
    it('fetches story corpus and returns 200 with story list array', async () => {
      const req = new NextRequest(new URL('http://localhost:3000/api/admin/stories/list'));
      const res = await listStoriesHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.stories)).toBe(true);
      expect(json.stories.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('2. Story Update API (/api/admin/stories/update)', () => {
    it('rejects updates without required fields with 400', async () => {
      const req = createMockRequest({ title: '' }, 'PUT');
      const res = await updateStoryHandler(req);
      expect(res.status).toBe(400);
    });

    it('successfully updates story and returns 200 with confirmation', async () => {
      const req = createMockRequest(
        {
          id: 'story-bella-rescue-001',
          oldSlug: 'bella-blind-beagle-sanctuary-journey',
          slug: 'bella-blind-beagle-sanctuary-journey-updated',
          title: "Bella's Incredible Mountain Journey (Updated)",
          content: 'Updated content for Bella the blind beagle.',
          dogName: 'Bella',
          dogBreed: 'Beagle',
          category: 'rescues',
        },
        'PUT'
      );
      const res = await updateStoryHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.slug).toBe('bella-blind-beagle-sanctuary-journey-updated');
    });
  });

  describe('3. Story Delete API (/api/admin/stories/delete)', () => {
    it('rejects delete requests without id or slug with 400', async () => {
      const req = createMockRequest({}, 'DELETE');
      const res = await deleteStoryHandler(req);
      expect(res.status).toBe(400);
    });

    it('successfully accepts deletion request and returns 200', async () => {
      const req = createMockRequest({ slug: 'old-temporary-story' }, 'DELETE');
      const res = await deleteStoryHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });
});
