/**
 * Phase 2 Server API Routes Integration Tests
 * Path: tests/api/api-routes.test.ts
 */

import { describe, it, expect } from 'vitest';
import { POST as subscribeHandler, GET as subscribeGetHandler } from '@/app/api/newsletter/subscribe/route';
import { POST as submitStoryHandler } from '@/app/api/stories/submit/route';
import { POST as submitCorrectionHandler } from '@/app/api/corrections/submit/route';
import { GET as getRedirectsHandler, POST as addRedirectHandler } from '@/app/api/admin/redirects/route';
import { NextRequest } from 'next/server';

function createMockRequest(body: unknown, method: string = 'POST', url: string = 'http://localhost:3000/api/test'): NextRequest {
  return new NextRequest(new URL(url), {
    method,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

describe('Phase 2 Server API Routes Suite', () => {
  describe('1. Newsletter Subscription API (/api/newsletter/subscribe)', () => {
    it('rejects empty email submission with 400', async () => {
      const req = createMockRequest({});
      const res = await subscribeHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain('required');
    });

    it('rejects invalid email formats (no domain / double dots)', async () => {
      const req = createMockRequest({ email: 'user..invalid@domain' });
      const res = await subscribeHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('successfully registers valid subscriber with 200', async () => {
      const req = createMockRequest({ email: 'doglover@example.com', source: 'test_suite' });
      const res = await subscribeHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.subscriber.email).toBe('doglover@example.com');
    });

    it('returns service status on GET', async () => {
      const res = await subscribeGetHandler();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.status).toBe('operational');
    });
  });

  describe('2. Story Submission API (/api/stories/submit)', () => {
    it('rejects submission with missing submitter name', async () => {
      const req = createMockRequest({
        submitterName: '',
        submitterEmail: 'amanda@example.com',
        dogName: 'Pete',
      });
      const res = await submitStoryHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain('Submitter name is required');
    });

    it('rejects narrative with fewer than 50 words', async () => {
      const req = createMockRequest({
        submitterName: 'Amanda Roberts',
        submitterEmail: 'amanda@example.com',
        dogName: 'Pete',
        locationCity: 'Hammond',
        storyTitle: 'Missing dog returned home miraculously',
        storyNarrative: 'Only a few words here.',
        photoCredit: 'Amanda',
        rightsConfirmed: true,
      });
      const res = await submitStoryHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain('50 words');
    });

    it('creates story draft and returns standard ticket SUB-YYYY-MMDD-XXXX with 201', async () => {
      const longNarrative = 'In the summer of 2021, our beloved dog disappeared during a sudden storm. We spent weeks searching every shelter, putting up flyers across town, and refusing to give up hope. Four years later, a microchip scan at a local veterinary clinic alerted us that he was safe. We drove immediately to be reunited, and the moment he saw us, his tail never stopped wagging.';
      const req = createMockRequest({
        submitterName: 'Amanda Roberts',
        submitterEmail: 'amanda@example.com',
        dogName: 'Pete',
        locationCity: 'Hammond',
        category: 'reunions',
        storyTitle: 'Missing for Four Years, Pete Recognized Us Instantly',
        storyNarrative: longNarrative,
        photoCredit: 'Photo courtesy of Amanda Roberts',
        rightsConfirmed: true,
      });
      const res = await submitStoryHandler(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.ticket.code).toMatch(/^SUB-\d{4}-\d{4}-[A-Z0-9]{4}$/);
      expect(json.ticket.status).toBe('pending_review');
    });
  });

  describe('3. Correction Request API (/api/corrections/submit)', () => {
    it('rejects correction request with missing story slug', async () => {
      const req = createMockRequest({
        storySlug: '',
        submitterName: 'John Doe',
        submitterEmail: 'john@example.com',
      });
      const res = await submitCorrectionHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain('Story slug is required');
    });

    it('submits valid correction and returns ticket CORR-YYYY-MMDD-XXXX with 201', async () => {
      const req = createMockRequest({
        storySlug: 'bella-blind-beagle-sanctuary-journey',
        storyTitle: 'Bella the Blind Beagle',
        submitterName: 'Clara Wong',
        submitterEmail: 'clara@shelter.org',
        issueType: 'Date/Timeline Inaccuracy',
        correctionDetails: 'The intake date occurred on March 15th rather than March 12th according to animal control log books.',
      });
      const res = await submitCorrectionHandler(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.ticket.code).toMatch(/^CORR-\d{4}-\d{4}-[A-Z0-9]{4}$/);
    });
  });

  describe('4. 301 Redirects API (/api/admin/redirects)', () => {
    it('lists existing 301 redirect rules on GET', async () => {
      const res = await getRedirectsHandler();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.redirects)).toBe(true);
      expect(json.redirects.length).toBeGreaterThanOrEqual(1);
    });

    it('rejects self-referencing redirect with 400', async () => {
      const req = createMockRequest({
        fromPath: '/stories/same-path',
        toPath: '/stories/same-path',
      });
      const res = await addRedirectHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain('Self-referencing');
    });

    it('successfully adds new 301 redirect with 201', async () => {
      const req = createMockRequest({
        fromPath: '/stories/old-daisy-slug',
        toPath: '/stories/daisy-500-mile-reunion-microchip-miracle',
      });
      const res = await addRedirectHandler(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.redirect.httpCode).toBe(301);
    });
  });
});
