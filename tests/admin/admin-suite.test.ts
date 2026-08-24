/**
 * Comprehensive Admin Operations & User Management Test Suite
 * Path: tests/admin/admin-suite.test.ts
 */

import { describe, it, expect } from 'vitest';
import { GET as getUsers, POST as createUser, PUT as updateUser, DELETE as deleteUser } from '@/app/api/admin/users/route';
import { GET as getSubmissions, PUT as updateSubmission } from '@/app/api/admin/submissions/route';
import { GET as getCorrections, PUT as updateCorrection } from '@/app/api/admin/corrections/route';
import { GET as getSubscribers, POST as broadcastNewsletter } from '@/app/api/admin/newsletter/broadcast/route';
import { GET as getAnalytics } from '@/app/api/admin/analytics/route';
import { GET as getAnnouncement, POST as updateAnnouncement } from '@/app/api/admin/announcements/route';
import { NextRequest } from 'next/server';

function createMockRequest(body: unknown, method: string = 'POST'): NextRequest {
  return new NextRequest(new URL('http://localhost:3000/api/admin/test'), {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('Admin Editorial Operations & User Management Suite', () => {
  describe('1. User & Staff Management (/api/admin/users)', () => {
    it('fetches admin staff list and includes super admin admin@eternal-paws.org', async () => {
      const res = await getUsers();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.users)).toBe(true);
      const superAdmin = json.users.find((u: any) => u.email === 'admin@eternal-paws.org');
      expect(superAdmin).toBeDefined();
      expect(superAdmin.role).toBe('super_admin');
    });

    it('creates new staff member with role editor and returns 201', async () => {
      const req = createMockRequest({
        email: 'test.writer@eternal-paws.com',
        name: 'Test Writer',
        role: 'editor',
      });
      const res = await createUser(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.user.email).toBe('test.writer@eternal-paws.com');
    });

    it('prevents deletion of primary Super Admin account with 403', async () => {
      const req = createMockRequest({ id: 'user-admin-001' }, 'DELETE');
      const res = await deleteUser(req);
      expect(res.status).toBe(403);
    });
  });

  describe('2. Reader Submissions Moderation (/api/admin/submissions)', () => {
    it('fetches pending submissions array and returns 200', async () => {
      const res = await getSubmissions();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.submissions)).toBe(true);
    });

    it('updates submission status to under_review or approved', async () => {
      const req = createMockRequest({ id: 'sub-001', status: 'under_review' }, 'PUT');
      const res = await updateSubmission(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });

  describe('3. Fact-Checking & Corrections Resolution (/api/admin/corrections)', () => {
    it('fetches correction requests and returns 200', async () => {
      const res = await getCorrections();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.corrections)).toBe(true);
    });

    it('updates correction resolution notes and status to resolved', async () => {
      const req = createMockRequest(
        { id: 'corr-001', status: 'resolved', resolutionNotes: 'Verified with shelter records.' },
        'PUT'
      );
      const res = await updateCorrection(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });

  describe('4. Newsletter Broadcast Campaign (/api/admin/newsletter/broadcast)', () => {
    it('fetches subscriber list and returns 200', async () => {
      const res = await getSubscribers();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.subscribers)).toBe(true);
    });

    it('dispatches Sunday digest broadcast and returns dispatch metrics', async () => {
      const req = createMockRequest({});
      const res = await broadcastNewsletter(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.dispatchedCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('5. Real-Time Analytics & Traffic Insights (/api/admin/analytics)', () => {
    it('returns traffic metrics with pageviews, top stories, and channels', async () => {
      const res = await getAnalytics();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.metrics.totalPageviews).toBeGreaterThan(0);
      expect(Array.isArray(json.metrics.topStories)).toBe(true);
    });
  });

  describe('6. Site Announcement Banner (/api/admin/announcements)', () => {
    it('reads active announcement and updates banner text with 200', async () => {
      const getRes = await getAnnouncement();
      expect(getRes.status).toBe(200);

      const postReq = createMockRequest({
        isActive: true,
        badgeText: '🚨 Breaking',
        message: 'New verified dog reunion in Texas!',
      });
      const postRes = await updateAnnouncement(postReq);
      expect(postRes.status).toBe(200);
      const json = await postRes.json();
      expect(json.announcement.badgeText).toBe('🚨 Breaking');
    });
  });
});
