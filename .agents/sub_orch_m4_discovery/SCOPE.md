# Scope: Milestone M4 — Discovery & High-Relevance Recommendation System

## Scope & Deliverables
- **Features**: F18, F19, F20
- **Deliverables**:
  1. **Weighted Fuzzy Search Engine (`src/features/discovery/search.ts`)**:
     - Multi-field search scoring: Dog Name (1.0), Breed (0.85), Location (0.80), Category (0.75), Emotional Theme (0.70), Story Title (0.60), Content (0.40).
     - Levenshtein distance ratio, token set matching, substring matching, typo tolerance, regex safety, and score thresholding (>=0.35).
     - Tie-breaking by Verification Status tier weight and publication date recency.
  2. **Multi-Signal Recommendation Engine (`src/features/discovery/recommendations.ts`)**:
     - Reader continuity affinity score: Category match (0.35) + Emotional Theme Jaccard similarity (0.35) + Dog attribute affinity (0.15) + Trust tier weighting (0.15).
     - Deterministic top-N related stories ranking with fallback to highest-ranked verified stories in the same category.
  3. **Discovery UI Components (`components/discovery/`)**:
     - `FuzzySearchBar.tsx`: Accessible search input with debouncing, clear button, and 44x44px touch targets.
     - `FilterPills.tsx`: Category and emotional theme filter pills with ARIA pressed states.
     - `RelatedStoriesGrid.tsx`: Responsive card grid for related stories with trust badges.
     - `CategoryCard.tsx`: Category highlight card.
     - `index.ts`: Barrel exports.
  4. **Search Page & API (`app/search/page.tsx`, `app/api/search/route.ts`)**:
     - Interactive search page with instant debounced results, query param synchronization, category facet pills, and zero-state suggestions.
     - API route handling `GET /api/search?q=...&category=...&theme=...`.
  5. **Unit & Component Tests**:
     - `tests/unit/fuzzy-search.test.ts`, `tests/unit/recommendations.test.ts`, `tests/components/discovery-components.test.tsx` passing 100%.

## Exclusive Write Ownership
- `src/features/discovery/**`
- `components/discovery/**`
- `app/search/**`
- `app/api/search/**`
- `tests/unit/fuzzy-search.test.ts`, `tests/unit/recommendations.test.ts`, `tests/components/discovery-components.test.tsx`
