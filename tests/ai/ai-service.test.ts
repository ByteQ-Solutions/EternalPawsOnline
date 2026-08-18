/**
 * AI Editorial Studio Integration & Service Unit Tests
 * Path: tests/ai/ai-service.test.ts
 */

import { describe, it, expect } from 'vitest';
import { AIService } from '@/lib/ai/ai-service';
import { POST as polishHandler } from '@/app/api/admin/ai/polish/route';
import { POST as generateHandler } from '@/app/api/admin/ai/generate/route';
import { NextRequest } from 'next/server';

function createMockRequest(body: unknown): NextRequest {
  return new NextRequest(new URL('http://localhost:3000/api/admin/ai/test'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('AI Editorial Assistant Suite (TokenRouter / DeepSeek / Qwen Multi-Provider)', () => {
  describe('1. AIService Narrative Polisher', () => {
    it('polishes raw text and returns heartwarming emotional narrative without errors', async () => {
      const rawText = 'dog got lost in snow but found way back home after 3 days';
      const result = await AIService.polishStory(rawText, 'Barnaby');

      expect(result.success).toBe(true);
      expect(result.polishedText).toBeDefined();
      expect(result.polishedText.length).toBeGreaterThan(rawText.length);
    });
  });

  describe('2. AIService Story Draft Generator', () => {
    it('generates structured story draft matching schema with title, excerpt, and sources', async () => {
      const result = await AIService.generateDraft({
        topic: 'Dog guided lost hikers in Rocky Mountains',
        dogName: 'Shadow',
        dogBreed: 'Alaskan Malamute',
        location: 'Colorado',
        category: 'hero-dogs',
      });

      expect(result.success).toBe(true);
      expect(result.draft.title).toBeDefined();
      expect(result.draft.dogName).toBe('Shadow');
      expect(result.draft.category).toBe('hero-dogs');
      expect(Array.isArray(result.draft.sources)).toBe(true);
    });
  });

  describe('3. AI Polish API Endpoint (/api/admin/ai/polish)', () => {
    it('rejects empty narrative submissions with 400', async () => {
      const req = createMockRequest({ text: '' });
      const res = await polishHandler(req);
      expect(res.status).toBe(400);
    });

    it('processes valid narrative and returns 200 with polished text', async () => {
      const req = createMockRequest({
        text: 'Bella was blind and walked 30 miles back to her owner.',
        dogName: 'Bella',
      });
      const res = await polishHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.polishedText).toBeDefined();
    });
  });

  describe('4. AI Generate API Endpoint (/api/admin/ai/generate)', () => {
    it('rejects empty topic with 400', async () => {
      const req = createMockRequest({ topic: '' });
      const res = await generateHandler(req);
      expect(res.status).toBe(400);
    });

    it('generates full story draft from topic and returns 200 with structured article draft', async () => {
      const req = createMockRequest({
        topic: 'Golden retriever saved child from lake',
        dogName: 'Rusty',
        dogBreed: 'Golden Retriever',
        location: 'Michigan',
      });
      const res = await generateHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.draft.title).toBeDefined();
    });
  });
});
