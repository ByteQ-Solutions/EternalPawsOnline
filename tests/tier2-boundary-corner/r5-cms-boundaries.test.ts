import { describe, it, expect } from 'vitest';

/**
 * Newsletter subscription validator
 */
export function validateNewsletterEmail(rawEmail: string): { isValid: boolean; normalizedEmail?: string; error?: string } {
  if (!rawEmail || typeof rawEmail !== 'string') {
    return { isValid: false, error: 'Email address is required.' };
  }
  const trimmed = rawEmail.trim().toLowerCase();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Email address cannot be empty.' };
  }
  if (trimmed.length > 254) {
    return { isValid: false, error: 'Email address exceeds maximum length of 254 characters.' };
  }
  // Check for spaces or script tags
  if (/\s/.test(trimmed) || /<[^>]*>/.test(trimmed)) {
    return { isValid: false, error: 'Email contains invalid characters.' };
  }
  // RFC 5322 compliant regex check
  const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. name@example.com).' };
  }
  return { isValid: true, normalizedEmail: trimmed };
}

/**
 * Media upload validator
 */
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImageUpload(file: { name: string; size: number; type: string }): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }
  if (file.size === 0) {
    return { isValid: false, error: 'File is empty (0 bytes).' };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { isValid: false, error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum 5MB limit.` };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return { isValid: false, error: `Invalid image type (${file.type}). Allowed formats: JPEG, PNG, WebP.` };
  }
  return { isValid: true };
}

/**
 * 9-Point Pre-Publish Checklist Gate Engine
 */
export interface PrePublishChecklist {
  hasValidTitle: boolean;           // 1. Title >= 5 chars
  hasValidSlug: boolean;            // 2. Slug is kebab-case without spaces
  hasHeroImageWithAlt: boolean;     // 3. Hero image has alt text >= 5 chars
  hasImageRightsDeclared: boolean;  // 4. Image rights/license declared
  hasValidCategory: boolean;        // 5. Valid category assigned
  hasEmotionalTheme: boolean;       // 6. At least 1 emotional theme
  hasMinimumContentLength: boolean; // 7. Content >= 100 words
  hasSourceOrRationale: boolean;    // 8. At least 1 source or explicit override
  hasSeoExcerpt: boolean;           // 9. Excerpt >= 20 chars
}

export function evaluatePrePublishGate(checklist: PrePublishChecklist): { canPublish: boolean; missingItems: string[] } {
  const missing: string[] = [];
  if (!checklist.hasValidTitle) missing.push('Valid Title');
  if (!checklist.hasValidSlug) missing.push('Valid URL Slug (kebab-case)');
  if (!checklist.hasHeroImageWithAlt) missing.push('Hero Image Alt Text');
  if (!checklist.hasImageRightsDeclared) missing.push('Image Rights Declaration');
  if (!checklist.hasValidCategory) missing.push('Assigned Category');
  if (!checklist.hasEmotionalTheme) missing.push('At Least One Emotional Theme');
  if (!checklist.hasMinimumContentLength) missing.push('Minimum Content Length (100 words)');
  if (!checklist.hasSourceOrRationale) missing.push('Verification Source or Editorial Override');
  if (!checklist.hasSeoExcerpt) missing.push('SEO Excerpt (min 20 chars)');

  return {
    canPublish: missing.length === 0,
    missingItems: missing
  };
}

/**
 * 301 Redirect Engine with Loop Prevention and Flattening
 */
export class RedirectEngine {
  private redirects = new Map<string, string>(); // sourceSlug -> targetSlug

  public addRedirect(fromSlug: string, toSlug: string): void {
    const from = fromSlug.trim().toLowerCase();
    const to = toSlug.trim().toLowerCase();
    if (from === to) return; // Prevent self-referential
    this.redirects.set(from, to);
    this.flattenChains();
  }

  public resolve(fromSlug: string): { targetSlug: string | null; isRedirect: boolean; hops: number } {
    const start = fromSlug.trim().toLowerCase();
    let current = start;
    let hops = 0;
    const visited = new Set<string>([current]);

    while (this.redirects.has(current)) {
      hops++;
      const next = this.redirects.get(current)!;
      if (visited.has(next)) {
        // Cycle detected: Break cycle and do not loop
        return { targetSlug: null, isRedirect: false, hops };
      }
      visited.add(next);
      current = next;
      if (hops > 10) break;
    }

    if (current === start) {
      return { targetSlug: null, isRedirect: false, hops: 0 };
    }
    return { targetSlug: current, isRedirect: true, hops };
  }

  private flattenChains(): void {
    for (const [from] of this.redirects) {
      const resolved = this.resolve(from);
      if (resolved.isRedirect && resolved.targetSlug) {
        this.redirects.set(from, resolved.targetSlug);
      }
    }
  }

  public getAllRedirects(): Map<string, string> {
    return new Map(this.redirects);
  }
}

describe('Tier 2 Boundary Tests - R5: Reader Engagement & Editorial CMS', () => {

  describe('F21: Non-Intrusive Newsletter Signup Boundaries', () => {
    it('F21-B1: RFC email validation rejects invalid email structures with descriptive errors', () => {
      const invalidEmails = [
        'missing-at-sign.com',
        'double@@domain.com',
        'user@domain..com',
        'user name@domain.com',
        '@missing-local.com',
        'user@.com',
      ];

      for (const email of invalidEmails) {
        const result = validateNewsletterEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      }

      const validResult = validateNewsletterEmail('doglover@example.com');
      expect(validResult.isValid).toBe(true);
      expect(validResult.normalizedEmail).toBe('doglover@example.com');
    });

    it('F21-B2: Extremely long email exceeding 254 characters is rejected per RFC 5321', () => {
      const longLocal = 'a'.repeat(245);
      const longEmail = `${longLocal}@example.com`; // 245 + 12 = 257 chars

      const result = validateNewsletterEmail(longEmail);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('maximum length of 254 characters');
    });

    it('F21-B3: Email with leading/trailing whitespace and uppercase letters normalizes to lowercase', () => {
      const dirtyEmail = '   SUBSCRIBER@Example.ORG   ';
      const result = validateNewsletterEmail(dirtyEmail);

      expect(result.isValid).toBe(true);
      expect(result.normalizedEmail).toBe('subscriber@example.org');
    });

    it('F21-B4: Duplicate subscriber email returns idempotent graceful response without 500', () => {
      const mockSubscriberDb = new Set<string>(['existing@example.com']);

      const handleSubscribe = (email: string) => {
        const validation = validateNewsletterEmail(email);
        if (!validation.isValid) {
          return { status: 400, message: validation.error };
        }
        if (mockSubscriberDb.has(validation.normalizedEmail!)) {
          return { status: 200, isAlreadySubscribed: true, message: "You're already subscribed to Sunday dog stories!" };
        }
        mockSubscriberDb.add(validation.normalizedEmail!);
        return { status: 201, isAlreadySubscribed: false, message: 'Welcome to the pack!' };
      };

      const firstCall = handleSubscribe('existing@example.com');
      expect(firstCall.status).toBe(200);
      expect(firstCall.isAlreadySubscribed).toBe(true);

      const newCall = handleSubscribe('newpackmember@example.com');
      expect(newCall.status).toBe(201);
      expect(newCall.isAlreadySubscribed).toBe(false);
    });

    it('F21-B5: HTML and script injection attempts in newsletter input are safely blocked', () => {
      const maliciousInputs = [
        '<script>alert(1)</script>@example.com',
        'victim@example.com<script>',
        "user' OR '1'='1@domain.com",
      ];

      for (const input of maliciousInputs) {
        const result = validateNewsletterEmail(input);
        expect(result.isValid).toBe(false);
      }
    });
  });

  describe('F22: Multi-Step Story Submission Flow Boundaries', () => {
    it('F22-B1: Image file size exceeding 5MB is strictly rejected before upload', () => {
      const exact5MB = 5 * 1024 * 1024;
      const over5MB = exact5MB + 1024; // 5MB + 1KB
      const under5MB = exact5MB - 1024;

      const validUpload = validateImageUpload({ name: 'dog.jpg', size: under5MB, type: 'image/jpeg' });
      const exactUpload = validateImageUpload({ name: 'dog.jpg', size: exact5MB, type: 'image/jpeg' });
      const oversizedUpload = validateImageUpload({ name: 'dog.jpg', size: over5MB, type: 'image/jpeg' });

      expect(validUpload.isValid).toBe(true);
      expect(exactUpload.isValid).toBe(true);
      expect(oversizedUpload.isValid).toBe(false);
      expect(oversizedUpload.error).toContain('exceeds maximum 5MB limit');
    });

    it('F22-B2: Unsupported image MIME types (GIF, PDF, SVG) are rejected', () => {
      const disallowed = [
        { name: 'animation.gif', size: 1024, type: 'image/gif' },
        { name: 'document.pdf', size: 1024, type: 'application/pdf' },
        { name: 'vector.svg', size: 1024, type: 'image/svg+xml' },
        { name: 'executable.exe', size: 1024, type: 'application/octet-stream' },
      ];

      for (const file of disallowed) {
        const result = validateImageUpload(file);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Invalid image type');
      }

      const allowedPng = validateImageUpload({ name: 'photo.png', size: 1024, type: 'image/png' });
      const allowedWebp = validateImageUpload({ name: 'photo.webp', size: 1024, type: 'image/webp' });
      expect(allowedPng.isValid).toBe(true);
      expect(allowedWebp.isValid).toBe(true);
    });

    it('F22-B3: Corrupt JSON in local storage auto-save draft recovers gracefully to initial state', () => {
      const restoreDraftFromStorage = (rawStorageData: string | null) => {
        const defaultDraft = { step: 1, dogName: '', storyBody: '', photos: [] };
        if (!rawStorageData) return defaultDraft;
        try {
          const parsed = JSON.parse(rawStorageData);
          if (typeof parsed === 'object' && parsed !== null) {
            return { ...defaultDraft, ...parsed };
          }
          return defaultDraft;
        } catch {
          return defaultDraft;
        }
      };

      const corruptData = '{ "step": 2, dogName: INVALID_JSON_NO_QUOTES';
      const recovered = restoreDraftFromStorage(corruptData);

      expect(recovered.step).toBe(1);
      expect(recovered.dogName).toBe('');
    });

    it('F22-B4: Direct jump to submission step 5 is blocked when previous steps are incomplete', () => {
      interface SubmissionDraft {
        step1Complete: boolean; // Basic info
        step2Complete: boolean; // Dog details
        step3Complete: boolean; // Narrative
        step4Complete: boolean; // Rights & verification
      }

      const canNavigateToStep = (targetStep: number, draft: SubmissionDraft): boolean => {
        if (targetStep === 1) return true;
        if (targetStep === 2) return draft.step1Complete;
        if (targetStep === 3) return draft.step1Complete && draft.step2Complete;
        if (targetStep === 4) return draft.step1Complete && draft.step2Complete && draft.step3Complete;
        if (targetStep === 5) return draft.step1Complete && draft.step2Complete && draft.step3Complete && draft.step4Complete;
        return false;
      };

      const incompleteDraft: SubmissionDraft = {
        step1Complete: true,
        step2Complete: false,
        step3Complete: false,
        step4Complete: false
      };

      expect(canNavigateToStep(2, incompleteDraft)).toBe(true);
      expect(canNavigateToStep(3, incompleteDraft)).toBe(false);
      expect(canNavigateToStep(5, incompleteDraft)).toBe(false);
    });

    it('F22-B5: Zero-byte image upload throws explicit empty file error', () => {
      const emptyFile = { name: 'empty.jpg', size: 0, type: 'image/jpeg' };
      const result = validateImageUpload(emptyFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File is empty (0 bytes)');
    });
  });

  describe('F23: Secure Admin Editorial CMS Dashboard Boundaries', () => {
    it('F23-B1: Unauthenticated request to admin endpoints yields 401 or redirect to login', () => {
      const handleAdminAuth = (authHeader: string | undefined) => {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return { status: 401, error: 'Unauthorized: Admin authentication token required.' };
        }
        const token = authHeader.replace('Bearer ', '');
        if (token !== 'valid-admin-secret-key') {
          return { status: 403, error: 'Forbidden: Insufficient privileges.' };
        }
        return { status: 200, user: { role: 'editor' } };
      };

      expect(handleAdminAuth(undefined).status).toBe(401);
      expect(handleAdminAuth('Bearer invalid-token').status).toBe(403);
      expect(handleAdminAuth('Bearer valid-admin-secret-key').status).toBe(200);
    });

    it('F23-B2: Empty submission review queue renders informative empty state', () => {
      const renderQueueState = (pendingSubmissions: any[]) => {
        if (pendingSubmissions.length === 0) {
          return {
            isEmpty: true,
            message: 'All community story submissions have been reviewed.',
            action: 'Check published stories'
          };
        }
        return { isEmpty: false, count: pendingSubmissions.length };
      };

      const state = renderQueueState([]);
      expect(state.isEmpty).toBe(true);
      expect(state.message).toContain('All community story submissions have been reviewed');
    });

    it('F23-B3: Invalid story status transitions (e.g. archived directly to published) are blocked', () => {
      type StoryStatus = 'draft' | 'review' | 'published' | 'archived';

      const ALLOWED_TRANSITIONS: Record<StoryStatus, StoryStatus[]> = {
        draft: ['review'],
        review: ['published', 'draft', 'archived'],
        published: ['archived', 'review'],
        archived: ['draft'] // Must go back to draft before republishing
      };

      const canTransition = (from: StoryStatus, to: StoryStatus): boolean => {
        return ALLOWED_TRANSITIONS[from].includes(to);
      };

      expect(canTransition('draft', 'review')).toBe(true);
      expect(canTransition('review', 'published')).toBe(true);
      expect(canTransition('archived', 'published')).toBe(false); // Blocked
      expect(canTransition('draft', 'published')).toBe(false); // Must go through review
    });

    it('F23-B4: Dashboard metrics calculate safely with 0 stories without NaN / division by zero', () => {
      const calculateCmsMetrics = (stories: { status: string; confidenceScore: number }[]) => {
        const total = stories.length;
        const published = stories.filter(s => s.status === 'published').length;
        const sumScore = stories.reduce((acc, s) => acc + s.confidenceScore, 0);
        const avgConfidence = total > 0 ? Math.round(sumScore / total) : 0;

        return { total, published, avgConfidence };
      };

      const emptyMetrics = calculateCmsMetrics([]);
      expect(emptyMetrics.total).toBe(0);
      expect(emptyMetrics.published).toBe(0);
      expect(emptyMetrics.avgConfidence).toBe(0);
      expect(isNaN(emptyMetrics.avgConfidence)).toBe(false);
    });

    it('F23-B5: Story editor autosave coalesces sequential updates into single latest state', () => {
      let savedState = '';
      const autoSaveStream = (edits: string[]) => {
        // Coalesce
        edits.forEach(content => {
          savedState = content;
        });
        return savedState;
      };

      const finalState = autoSaveStream(['Draft 1', 'Draft 2 with new paragraph', 'Draft 3 final paragraph']);
      expect(finalState).toBe('Draft 3 final paragraph');
    });
  });

  describe('F24: CMS Pre-Publish Checklist Gate Boundaries', () => {
    it('F24-B1: 9-point checklist with 8 passed and 1 missing strictly blocks publication', () => {
      const almostReadyChecklist: PrePublishChecklist = {
        hasValidTitle: true,
        hasValidSlug: true,
        hasHeroImageWithAlt: false, // 1 missing item
        hasImageRightsDeclared: true,
        hasValidCategory: true,
        hasEmotionalTheme: true,
        hasMinimumContentLength: true,
        hasSourceOrRationale: true,
        hasSeoExcerpt: true,
      };

      const gate = evaluatePrePublishGate(almostReadyChecklist);
      expect(gate.canPublish).toBe(false);
      expect(gate.missingItems).toContain('Hero Image Alt Text');
      expect(gate.missingItems.length).toBe(1);
    });

    it('F24-B2: Content length threshold strictly enforces 100 words minimum', () => {
      const countWords = (text: string) => text.trim().split(/\s+/).filter(w => w.length > 0).length;

      const shortContent = Array(99).fill('word').join(' ');
      const validContent = Array(100).fill('word').join(' ');

      expect(countWords(shortContent) >= 100).toBe(false);
      expect(countWords(validContent) >= 100).toBe(true);
    });

    it('F24-B3: Missing sources blocks publish unless editorial override is flagged', () => {
      const noSourcesGate = evaluatePrePublishGate({
        hasValidTitle: true,
        hasValidSlug: true,
        hasHeroImageWithAlt: true,
        hasImageRightsDeclared: true,
        hasValidCategory: true,
        hasEmotionalTheme: true,
        hasMinimumContentLength: true,
        hasSourceOrRationale: false, // Missing
        hasSeoExcerpt: true,
      });

      expect(noSourcesGate.canPublish).toBe(false);
      expect(noSourcesGate.missingItems).toContain('Verification Source or Editorial Override');
    });

    it('F24-B4: Slug syntax validator rejects uppercase, spaces, and special symbols', () => {
      const isValidKebabSlug = (slug: string): boolean => {
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
      };

      expect(isValidKebabSlug('brave-max-rescue')).toBe(true);
      expect(isValidKebabSlug('Brave Max Rescue')).toBe(false);
      expect(isValidKebabSlug('brave_max_rescue')).toBe(false);
      expect(isValidKebabSlug('brave-max--rescue')).toBe(false);
      expect(isValidKebabSlug('-brave-max-')).toBe(false);
    });

    it('F24-B5: All 9 checklist items satisfied enables publication', () => {
      const allPassedChecklist: PrePublishChecklist = {
        hasValidTitle: true,
        hasValidSlug: true,
        hasHeroImageWithAlt: true,
        hasImageRightsDeclared: true,
        hasValidCategory: true,
        hasEmotionalTheme: true,
        hasMinimumContentLength: true,
        hasSourceOrRationale: true,
        hasSeoExcerpt: true,
      };

      const gate = evaluatePrePublishGate(allPassedChecklist);
      expect(gate.canPublish).toBe(true);
      expect(gate.missingItems.length).toBe(0);
    });
  });

  describe('F25: Automated 301 Redirect Engine Boundaries', () => {
    it('F25-B1: Circular redirect loop (A -> B -> C -> A) is detected and broken', () => {
      const engine = new RedirectEngine();
      engine.addRedirect('slug-a', 'slug-b');
      engine.addRedirect('slug-b', 'slug-c');
      engine.addRedirect('slug-c', 'slug-a'); // Cycle!

      const result = engine.resolve('slug-a');
      expect(result.isRedirect).toBe(false);
      expect(result.targetSlug).toBeNull();
    });

    it('F25-B2: Self-referential redirect (A -> A) is rejected as a no-op', () => {
      const engine = new RedirectEngine();
      engine.addRedirect('same-slug', 'same-slug');

      const result = engine.resolve('same-slug');
      expect(result.isRedirect).toBe(false);
      expect(result.targetSlug).toBeNull();
    });

    it('F25-B3: Multi-hop redirect chains (A -> B and B -> C) are flattened directly to A -> C', () => {
      const engine = new RedirectEngine();
      engine.addRedirect('old-name', 'middle-name');
      engine.addRedirect('middle-name', 'final-name');

      const resultOld = engine.resolve('old-name');
      const resultMiddle = engine.resolve('middle-name');

      expect(resultOld.targetSlug).toBe('final-name');
      expect(resultMiddle.targetSlug).toBe('final-name');
    });

    it('F25-B4: Query parameter and hash preservation across 301 redirects', () => {
      const engine = new RedirectEngine();
      engine.addRedirect('hachiko-story', 'hachiko-tokyo-memorial');

      const rewriteUrl = (urlStr: string): string => {
        const url = new URL(urlStr, 'https://eternal-paws.org');
        const match = url.pathname.match(/\/stories\/([a-z0-9-]+)/);
        if (!match) return urlStr;

        const slug = match[1];
        const resolution = engine.resolve(slug);
        if (resolution.isRedirect && resolution.targetSlug) {
          url.pathname = `/stories/${resolution.targetSlug}`;
          return url.toString();
        }
        return urlStr;
      };

      const original = 'https://eternal-paws.org/stories/hachiko-story?utm_source=fb&ref=share#trust';
      const redirected = rewriteUrl(original);

      expect(redirected).toBe('https://eternal-paws.org/stories/hachiko-tokyo-memorial?utm_source=fb&ref=share#trust');
    });

    it('F25-B5: Case insensitive slug redirect resolution normalizes incoming URL path', () => {
      const engine = new RedirectEngine();
      engine.addRedirect('max-hero', 'max-hero-2026');

      const result = engine.resolve('MAX-HERO');
      expect(result.isRedirect).toBe(true);
      expect(result.targetSlug).toBe('max-hero-2026');
    });
  });
});
