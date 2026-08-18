## 2026-08-18T02:19:18Z

You are Explorer 2 for Milestone M4 (Discovery: Multi-Signal Recommendation Engine).
Your working directory: e:/Claude/EternalPaws/Eternal-Paws/.agents/explorer_m4_2
Project root: e:/Claude/EternalPaws/Eternal-Paws

Read the authoritative requirements:
- e:/Claude/EternalPaws/Eternal-Paws/ORIGINAL_REQUEST.md
- e:/Claude/EternalPaws/Eternal-Paws/PROJECT.md
- e:/Claude/EternalPaws/Eternal-Paws/.agents/sub_orch_m4_discovery/SCOPE.md

Investigate the codebase (existing domain types in `src/domain/types.ts`, story data in `src/lib/data/`, verification schemas, and helper utilities).

Your focus:
1. Design the Multi-Signal Recommendation Engine (`src/features/discovery/recommendations.ts` and `src/features/discovery/index.ts`).
2. Specify the Reader Continuity Affinity Scoring algorithm:
   - Category affinity (0.35 weight): Exact category match.
   - Emotional Theme Jaccard similarity (0.35 weight): `|Themes(A) ∩ Themes(B)| / |Themes(A) ∪ Themes(B)|`.
   - Dog attribute affinity (0.15 weight): Same breed match, same dog name, location proximity/match.
   - Trust tier weighting (0.15 weight): verification confidence score / status tier bonus.
3. Ranking and Selection Logic:
   - Filter out the `currentStory.id`.
   - Rank candidate stories deterministically by composite affinity score descending.
   - Fallback mechanism: If fewer candidates than `limit` meet the threshold, backfill with highest-scoring verified stories in the same category or overall highest trust stories.
   - Signature: `export function getRelatedStories(currentStory: Story, allStories: Story[], limit?: number): Story[];`
4. Specify edge cases: Empty stories array, single story in database, no shared themes, missing location, all unverified stories.
5. Recommend unit test cases for `tests/unit/recommendations.test.ts`.

Write your full structured report to `e:/Claude/EternalPaws/Eternal-Paws/.agents/explorer_m4_2/handoff.md` and send a message when done.
