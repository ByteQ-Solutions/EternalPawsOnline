/**
 * Tier 1 Feature Coverage: R4 - Discovery & High-Relevance Recommendation System
 * 
 * Features Covered:
 * - F18: Weighted Fuzzy Search Engine (5 tests)
 * - F19: Multi-Signal Related Story Engine (5 tests)
 * - F20: Search & Discovery Page (`/search`) (5 tests)
 * 
 * Total: 15 tests
 */

import { describe, it, expect } from 'vitest';
import {
  storyBellaRescue,
  storyBarnabySurvival,
  storyMaxHero,
  storyDaisyReunion,
  storyDukeLoyalty,
  storyLunaMiracle,
  allSeedStories,
  publishedSeedStories
} from '../harness/fixtures';
import {
  calculateFuzzyMatchScore,
  searchStoriesInCorpus,
  calculateRelatedStoryScore,
  getRelatedStoriesFromCorpus,
  stringSimilarity
} from '../harness/test-utils';

export function registerR4DiscoveryTests(): void {
  describe('F18: Weighted Fuzzy Search Engine', () => {
    it('F18-1: dog name exact match receives highest relevance score (1.0 weight)', () => {
      const match = calculateFuzzyMatchScore('Bella', storyBellaRescue);
      expect(match.score).toBeGreaterThanOrEqual(1.0);
      expect(match.matchedFields).toContain('dogName');
    });

    it('F18-2: dog breed match receives weighted relevance score (0.85 weight)', () => {
      const match = calculateFuzzyMatchScore('Golden Retriever', storyBarnabySurvival);
      expect(match.score).toBeGreaterThanOrEqual(0.85);
      expect(match.matchedFields).toContain('dogBreed');
    });

    it('F18-3: location match receives weighted relevance score (0.80 weight)', () => {
      const match = calculateFuzzyMatchScore('Aspen', storyMaxHero);
      expect(match.score).toBeGreaterThanOrEqual(0.80);
      expect(match.matchedFields).toContain('location');
    });

    it('F18-4: typo-tolerant fuzzy matching identifies dog name with 1-character typo ("Barnby" -> "Barnaby")', () => {
      const sim = stringSimilarity('Barnby', 'Barnaby');
      expect(sim).toBeGreaterThanOrEqual(0.80);

      const match = calculateFuzzyMatchScore('Barnby', storyBarnabySurvival);
      expect(match.score).toBeGreaterThan(0.70);
      expect(match.matchedFields).toContain('dogName');
    });

    it('F18-5: multi-field query matches across title, excerpt, and theme keywords', () => {
      const match = calculateFuzzyMatchScore('avalanche', storyMaxHero);
      expect(match.score).toBeGreaterThanOrEqual(0.40);
      expect(match.matchedFields.length).toBeGreaterThan(0);
    });
  });

  describe('F19: Multi-Signal Related Story Engine', () => {
    it('F19-1: related stories recommendation engine strictly excludes current viewed story', () => {
      const related = getRelatedStoriesFromCorpus(storyBellaRescue, publishedSeedStories, 3);
      for (const item of related) {
        expect(item.id).not.toBe(storyBellaRescue.id);
      }
    });

    it('F19-2: candidate stories sharing the same category receive substantial affinity boost', () => {
      const sameCategoryCandidate = storyLunaMiracle; // both 'rescues'
      const differentCategoryCandidate = storyMaxHero; // 'hero-dogs'

      const scoreSame = calculateRelatedStoryScore(storyBellaRescue, sameCategoryCandidate);
      const scoreDiff = calculateRelatedStoryScore(storyBellaRescue, differentCategoryCandidate);

      expect(scoreSame).toBeGreaterThan(scoreDiff);
    });

    it('F19-3: emotional theme Jaccard overlap increases continuity score', () => {
      // storyBellaRescue themes: ['inspiring', 'heartwarming', 'miraculous']
      // storyLunaMiracle themes: ['inspiring', 'joyful', 'miraculous'] (2/4 overlap)
      const score = calculateRelatedStoryScore(storyBellaRescue, storyLunaMiracle);
      expect(score).toBeGreaterThanOrEqual(0.50);
    });

    it('F19-4: related stories ranking prioritizes higher verification confidence score', () => {
      const relatedList = getRelatedStoriesFromCorpus(storyBarnabySurvival, publishedSeedStories, 5);
      expect(relatedList.length).toBeGreaterThanOrEqual(2);
      // Top related story should have a solid verification score
      expect(relatedList[0].verification.confidenceScore).toBeGreaterThanOrEqual(60);
    });

    it('F19-5: respects the limit parameter and returns exact requested number of items', () => {
      const limit = 2;
      const related = getRelatedStoriesFromCorpus(storyDaisyReunion, publishedSeedStories, limit);
      expect(related.length).toBe(limit);
    });
  });

  describe('F20: Search & Discovery Page (`/search`)', () => {
    it('F20-1: filters story results by category correctly', () => {
      const results = searchStoriesInCorpus(publishedSeedStories, { category: 'hero-dogs' });
      expect(results.length).toBeGreaterThanOrEqual(1);
      for (const res of results) {
        expect(res.story.category).toBe('hero-dogs');
      }
    });

    it('F20-2: filters story results by emotional theme correctly', () => {
      const results = searchStoriesInCorpus(publishedSeedStories, { emotionalTheme: 'brave' });
      expect(results.length).toBeGreaterThanOrEqual(2);
      for (const res of results) {
        expect(res.story.emotionalThemes).toContain('brave');
      }
    });

    it('F20-3: filters story results by verification status (e.g. `Strongly Verified` only)', () => {
      const results = searchStoriesInCorpus(publishedSeedStories, { verificationStatus: 'Strongly Verified' });
      expect(results.length).toBeGreaterThanOrEqual(3);
      for (const res of results) {
        expect(res.story.verification.status).toBe('Strongly Verified');
      }
    });

    it('F20-4: returns all published stories when search filter query is empty (zero-state suggestions)', () => {
      const results = searchStoriesInCorpus(publishedSeedStories, {});
      expect(results.length).toBe(publishedSeedStories.length);
      // Featured stories should receive top relevance in zero-state
      expect(results[0].relevanceScore).toBeGreaterThanOrEqual(results[results.length - 1].relevanceScore);
    });

    it('F20-5: sorts search results descending by relevance score', () => {
      const results = searchStoriesInCorpus(publishedSeedStories, { query: 'rescue' });
      expect(results.length).toBeGreaterThanOrEqual(2);
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].relevanceScore).toBeGreaterThanOrEqual(results[i + 1].relevanceScore);
      }
    });
  });
}

registerR4DiscoveryTests();

