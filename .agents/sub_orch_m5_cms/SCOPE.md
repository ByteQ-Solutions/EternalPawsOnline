# Scope: Milestone M5 — Reader Engagement, Submissions & Admin Editorial CMS

## Scope & Deliverables
- **Features**: F21, F22, F23, F24, F25
- **Deliverables**:
  1. **Reader Engagement & Newsletter (`src/features/engagement/`, `components/engagement/`, `app/api/newsletter/route.ts`)**:
     - `NewsletterBanner.tsx`: "Join the Pack - One True Dog Story Every Sunday" inline CTA with RFC 5322 email validation, loading states, success feedback, and idempotent handling.
     - `NewsletterService`: Subscription intake and in-memory/mock repository.
  2. **Multi-Step Story Submission Flow (`src/features/submissions/`, `components/engagement/StorySubmissionWizard.tsx`, `app/submit-story/page.tsx`, `app/api/submit-story/route.ts`)**:
     - 5-step wizard: Dog identity -> True Narrative -> Media Upload & AI declaration -> Sources & Corroboration -> Submitter Credentials & Terms.
     - `localStorage` draft auto-save and restore mechanism with toast notification.
     - Media upload validation (max 5MB, JPEG/PNG/WebP, alt text enforcement).
  3. **Admin Editorial CMS Dashboard (`src/features/cms/`, `components/admin/`, `app/admin/`)**:
     - `app/admin/page.tsx`: Dashboard with story metrics (total stories, verified count, pending reviews) and submission moderation queue.
     - `app/admin/stories/page.tsx`: Story manager table with filter by status.
     - `app/admin/stories/[id]/edit/page.tsx` & `app/admin/stories/new/page.tsx`: Story editor with source manager.
     - `components/admin/PrePublishChecklist.tsx`: 9-point automated checklist validation component (alt text, rights, sources, slug format, slug uniqueness, SEO meta, content length, taxonomy, trust card).
  4. **Automated 301 Redirect Engine (`src/features/cms/redirects.ts`, `src/middleware.ts`, `app/admin/redirects/page.tsx`, `app/api/admin/redirects/route.ts`)**:
     - Automatic detection of slug updates and creation of 301 redirect records.
     - Graph flattening ($A \to B \to C \implies A \to C$) and circular redirect loop prevention.
     - Next.js middleware interceptor (`src/middleware.ts`) serving HTTP 301 redirects.
     - Admin redirect manager UI (`app/admin/redirects/page.tsx`).
  5. **Unit & Integration Tests**:
     - `tests/unit/cms-validator.test.ts`, `tests/unit/redirect-engine.test.ts`, `tests/unit/submission-workflow.test.ts`, `tests/components/cms-components.test.tsx` passing 100%.

## Exclusive Write Ownership
- `src/features/engagement/**`, `src/features/submissions/**`, `src/features/cms/**`
- `components/engagement/**`, `components/admin/**`
- `app/submit-story/**`, `app/admin/**`
- `app/api/newsletter/**`, `app/api/submit-story/**`, `app/api/admin/**`
- `src/middleware.ts`
- `tests/unit/cms-validator.test.ts`, `tests/unit/redirect-engine.test.ts`, `tests/unit/submission-workflow.test.ts`, `tests/components/cms-components.test.tsx`
