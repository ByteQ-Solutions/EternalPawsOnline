## 2026-08-17T20:26:03Z

<USER_REQUEST>
You are Explorer 2 for Milestone M3 (Web Platform, SSR/SSG & Media Engine).
Working directory: e:/Claude/EternalPaws/Eternal-Paws/.agents/explorer_m3_components
Project root: e:/Claude/EternalPaws/Eternal-Paws

Read:
- e:/Claude/EternalPaws/Eternal-Paws/ORIGINAL_REQUEST.md
- e:/Claude/EternalPaws/Eternal-Paws/PROJECT.md
- e:/Claude/EternalPaws/Eternal-Paws/.agents/sub_orch_m3_platform/SCOPE.md

Your focus:
Investigate and design specifications for Article UI and Media Components:
1. Examine existing design tokens (`src/design-system/tokens.ts`), Trust Card components from M2 (`components/trust/` or `src/components/trust/` if any), and domain models (`src/domain/types.ts`).
2. Plan the implementation specifications for:
   - `components/article/ArticleHeader.tsx`: Title, subtitle, dog details badge (name, breed, location, status), author, publish date, read time.
   - `components/article/ArticleContent.tsx`: Typography-styled editorial story narrative with paragraph formatting, drop caps, blockquotes if applicable.
   - `components/article/OptimizedDogImage.tsx`: Zero-CLS image wrapper with explicit width/height, aspect-ratio reservation, responsive sizing (`sizes`), proper loading/decoding, and AI disclosure pill integration when `aiDisclosure.isAiGenerated` is true.
   - `components/article/ReadingProgressBar.tsx`: Non-intrusive slim top reading progress indicator tracking scroll depth along the article.
   - `components/article/ShareBar.tsx`: Accessible social share (Twitter/X, Facebook, Email) and copy link buttons with toast/feedback, ensuring minimum 44x44px touch targets.
   - `components/article/index.ts`: Clean barrel exports.
3. Ensure accessibility (aria attributes, keyboard interactions), zero-CLS styling, and design token integration.
4. Write your comprehensive report to `e:/Claude/EternalPaws/Eternal-Paws/.agents/explorer_m3_components/analysis.md` and `e:/Claude/EternalPaws/Eternal-Paws/.agents/explorer_m3_components/handoff.md`.
5. Send a completion message to the parent with your summary.
</USER_REQUEST>
