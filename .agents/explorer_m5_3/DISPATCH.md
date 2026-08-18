## 2026-08-17T20:49:17Z

Investigate and produce a comprehensive architectural plan and specifications for:
1. Automated 301 Redirect Engine (F25):
   - `src/features/cms/redirects.ts` & `src/lib/services/redirect-service.ts`
   - Automatic detection of slug updates when stories are edited
   - Creation of 301 redirect records (source path -> destination path, createdAt, statusCode: 301)
   - Graph flattening algorithm: If redirect A -> B exists and B changes to C, flatten so A -> C and B -> C
   - Circular redirect loop prevention: Detect cycles (A -> B -> A) and prevent/resolve self-referential or looping redirects
2. Next.js Middleware Interceptor:
   - `src/middleware.ts`: Intercept incoming requests, check against redirect registry/service, return `NextResponse.redirect(new URL(destination, request.url), 301)` for matching paths, pass through other requests.
3. Admin Redirect Manager UI & API:
   - `app/admin/redirects/page.tsx` (Table of active redirects, manual addition, deletion, edit, status test)
   - `app/api/admin/redirects/route.ts` (CRUD for redirect rules)
4. Integration with story edit workflow (`app/admin/stories/[id]/edit/page.tsx`) when slug changes.
5. Define concrete test plans for `tests/unit/redirect-engine.test.ts`.

Write findings and implementation roadmap to `e:/Claude/EternalPaws/Eternal-Paws/.agents/explorer_m5_3/handoff.md` and send a summary message when done.
