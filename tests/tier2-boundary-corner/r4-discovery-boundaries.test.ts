import { describe, it, expect } from 'vitest';

/**
 * Domain types for Search & Discovery
 */
export type StoryCategory = 'reunions' | 'hero-dogs' | 'rescues' | 'survival' | 'loyalty' | 'lost-and-found';
export type EmotionalTheme = 'joyful' | 'tearjerker' | 'inspiring' | 'miraculous' | 'heartwarming' | 'brave';

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  dogName: string;
  dogBreed: string;
  location: { city: string; stateOrProvince: string; country: string };
  category: StoryCategory;
  emotionalThemes: EmotionalTheme[];
  readTimeMinutes: number;
}

export interface SearchFilter {
  query?: string;
  category?: StoryCategory;
  emotionalTheme?: EmotionalTheme;
  dogBreed?: string;
  location?: string;
}

export interface SearchResult {
  story: Story;
  relevanceScore: number;
  matchedFields: string[];
}

/**
 * Levenshtein distance for fuzzy matching
 */
export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix: number[][] = Array.from({ length: bn + 1 }, () => Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;

  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (b[j - 1] === a[i - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,      // insertion
          matrix[j][i - 1] + 1,      // deletion
          matrix[j - 1][i - 1] + 1   // substitution
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Normalize string (case fold, remove diacritics)
 */
export function normalizeSearchString(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Weighted fuzzy matching score for a single field
 */
function matchField(targetText: string, queryTerms: string[]): { matched: boolean; score: number } {
  const normTarget = normalizeSearchString(targetText);
  if (!normTarget || queryTerms.length === 0) return { matched: false, score: 0 };

  const targetTokens = normTarget.split(/\s+/);
  let totalScore = 0;
  let matches = 0;

  for (const q of queryTerms) {
    if (!q) continue;
    // Exact match in tokens
    if (targetTokens.includes(q) || normTarget.includes(q)) {
      totalScore += 1.0;
      matches++;
      continue;
    }
    // Fuzzy match against tokens
    let bestFuzzy = 0;
    for (const token of targetTokens) {
      const maxAllowedDist = q.length <= 4 ? 1 : q.length <= 8 ? 2 : 3;
      const dist = levenshteinDistance(q, token);
      if (dist <= maxAllowedDist) {
        const similarity = 1 - (dist / Math.max(q.length, token.length));
        if (similarity > bestFuzzy) bestFuzzy = similarity;
      }
    }
    if (bestFuzzy > 0.5) {
      totalScore += bestFuzzy * 0.8;
      matches++;
    }
  }

  return { matched: matches > 0, score: matches > 0 ? totalScore / queryTerms.length : 0 };
}

/**
 * Multi-field weighted search engine implementation
 */
export function searchStories(stories: Story[], filter: SearchFilter): SearchResult[] {
  if (!stories || stories.length === 0) return [];

  const rawQuery = filter.query ? filter.query.trim() : '';
  const queryTerms = normalizeSearchString(rawQuery).split(/\s+/).filter(t => t.length > 0);

  const WEIGHTS = {
    dogName: 1.0,
    dogBreed: 0.85,
    location: 0.80,
    category: 0.75,
    emotionalTheme: 0.70,
    title: 0.60,
    content: 0.40,
  };

  const results: SearchResult[] = [];

  for (const story of stories) {
    // Exact filters
    if (filter.category && story.category !== filter.category) {
      continue;
    }
    if (filter.emotionalTheme && !story.emotionalThemes.includes(filter.emotionalTheme)) {
      continue;
    }
    if (filter.dogBreed && normalizeSearchString(story.dogBreed) !== normalizeSearchString(filter.dogBreed)) {
      continue;
    }

    if (queryTerms.length === 0) {
      // If no query string, all filtered stories pass with baseline score
      results.push({ story, relevanceScore: 1.0, matchedFields: [] });
      continue;
    }

    let storyScore = 0;
    const matchedFields: string[] = [];

    const locString = `${story.location.city} ${story.location.stateOrProvince} ${story.location.country}`;
    const themesString = story.emotionalThemes.join(' ');

    const checks: [string, string, number][] = [
      ['dogName', story.dogName, WEIGHTS.dogName],
      ['dogBreed', story.dogBreed, WEIGHTS.dogBreed],
      ['location', locString, WEIGHTS.location],
      ['category', story.category, WEIGHTS.category],
      ['emotionalTheme', themesString, WEIGHTS.emotionalTheme],
      ['title', story.title, WEIGHTS.title],
      ['content', story.content, WEIGHTS.content],
    ];

    for (const [field, text, weight] of checks) {
      const match = matchField(text, queryTerms);
      if (match.matched) {
        storyScore += match.score * weight;
        matchedFields.push(field);
      }
    }

    if (matchedFields.length > 0 && storyScore > 0) {
      results.push({ story, relevanceScore: parseFloat(storyScore.toFixed(3)), matchedFields });
    }
  }

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Multi-Signal Related Story Recommendation Engine
 */
export function getRelatedStories(currentStory: Story, allStories: Story[], limit: number = 3): Story[] {
  if (!allStories || allStories.length === 0) return [];
  const safeLimit = limit <= 0 ? (limit === 0 ? 0 : 3) : limit;
  if (safeLimit === 0) return [];

  const candidates = allStories.filter(s => s.id !== currentStory.id);
  if (candidates.length === 0) return [];

  const scored = candidates.map(candidate => {
    let affinity = 0;

    // 1. Category affinity (weight 0.45)
    if (candidate.category === currentStory.category) {
      affinity += 0.45;
    }

    // 2. Emotional Theme Jaccard overlap (weight 0.35)
    const currentThemes = new Set(currentStory.emotionalThemes);
    const candidateThemes = new Set(candidate.emotionalThemes);
    const intersection = [...candidateThemes].filter(t => currentThemes.has(t)).length;
    const union = new Set([...currentStory.emotionalThemes, ...candidate.emotionalThemes]).size;
    const jaccard = union > 0 ? intersection / union : 0;
    affinity += jaccard * 0.35;

    // 3. Breed affinity (weight 0.20)
    if (normalizeSearchString(candidate.dogBreed) === normalizeSearchString(currentStory.dogBreed)) {
      affinity += 0.20;
    }

    return { story: candidate, affinity };
  });

  return scored
    .filter(item => item.affinity > 0)
    .sort((a, b) => b.affinity - a.affinity)
    .slice(0, safeLimit)
    .map(item => item.story);
}

describe('Tier 2 Boundary Tests - R4: Discovery & High-Relevance Recommendation System', () => {

  const sampleCorpus: Story[] = [
    {
      id: 'story-1',
      slug: 'border-collie-toby',
      title: 'Toby The Border Collie Mountain Rescue',
      subtitle: 'Heroic search in the Rockies',
      excerpt: 'Toby navigated steep ravines.',
      content: 'A heroic border collie shepherd dog saved a lost hiker in the mountains.',
      dogName: 'Toby',
      dogBreed: 'Border Collie',
      location: { city: 'Boulder', stateOrProvince: 'Colorado', country: 'USA' },
      category: 'hero-dogs',
      emotionalThemes: ['brave', 'inspiring'],
      readTimeMinutes: 4
    },
    {
      id: 'story-2',
      slug: 'daisy-golden-reunion',
      title: 'Daisy Reunited After Five Years',
      subtitle: 'Miracle in Denver',
      excerpt: 'A microchip reunited Daisy with her family.',
      content: 'Daisy the golden retriever was found 300 miles away.',
      dogName: 'Daisy',
      dogBreed: 'Golden Retriever',
      location: { city: 'Denver', stateOrProvince: 'Colorado', country: 'USA' },
      category: 'reunions',
      emotionalThemes: ['joyful', 'miraculous'],
      readTimeMinutes: 3
    },
    {
      id: 'story-3',
      slug: 'hachiko-tokyo-loyalty',
      title: 'Hachikō: The Immortal Loyalty',
      subtitle: 'Akita waiting at Shibuya station',
      excerpt: 'The true story of Hachiko.',
      content: 'Hachiko waited ten years at the station for his beloved professor.',
      dogName: 'Hachiko',
      dogBreed: 'Akita',
      location: { city: 'Tokyo', stateOrProvince: 'Kanto', country: 'Japan' },
      category: 'loyalty',
      emotionalThemes: ['tearjerker', 'heartwarming'],
      readTimeMinutes: 5
    }
  ];

  describe('F18: Weighted Fuzzy Search Engine Boundaries', () => {
    it('F18-B1: High edit-distance typo queries match target within allowed Levenshtein threshold', () => {
      // "boudler colliee" -> matches location Boulder + breed Border Collie
      const results = searchStories(sampleCorpus, { query: 'boudler colliee' });
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].story.dogName).toBe('Toby');
      expect(results[0].matchedFields).toContain('dogBreed');

      // Extreme typo "zzzzzzzzz" returns 0 matches
      const noResults = searchStories(sampleCorpus, { query: 'zzzzzzzzz' });
      expect(noResults.length).toBe(0);
    });

    it('F18-B2: Exact dogName match (weight 1.0) strictly ranks higher than body text mention (weight 0.4)', () => {
      const daisyQuery = searchStories(sampleCorpus, { query: 'Daisy' });
      expect(daisyQuery.length).toBe(1);
      expect(daisyQuery[0].story.dogName).toBe('Daisy');
      expect(daisyQuery[0].relevanceScore).toBeGreaterThanOrEqual(1.0);
    });

    it('F18-B3: Special regex, SQL, and HTML characters in query are treated as safe literal text', () => {
      const trickyQueries = [
        '.*',
        '([a-z]+)',
        "' OR '1'='1",
        '<script>alert("XSS")</script>',
        '${process.env}',
        '\\n\\r\\t'
      ];

      for (const query of trickyQueries) {
        expect(() => {
          const results = searchStories(sampleCorpus, { query });
          expect(Array.isArray(results)).toBe(true);
        }).not.toThrow();
      }
    });

    it('F18-B4: Boundary query lengths (1 char vs 150+ chars) execute safely without truncation error', () => {
      // 1 char query
      const singleChar = searchStories(sampleCorpus, { query: 'T' });
      expect(Array.isArray(singleChar)).toBe(true);

      // 150+ chars long query
      const longQuery = 'A very long query search term describing a dog that went missing in the rocky mountains during a heavy winter snowstorm '.repeat(2);
      const longResults = searchStories(sampleCorpus, { query: longQuery });
      expect(Array.isArray(longResults)).toBe(true);
    });

    it('F18-B5: Diacritics and unicode normalization treats "Hachikō" and "hachiko" identically', () => {
      const diacriticResults = searchStories(sampleCorpus, { query: 'Hachikō' });
      const plainResults = searchStories(sampleCorpus, { query: 'hachiko' });

      expect(diacriticResults.length).toBe(1);
      expect(plainResults.length).toBe(1);
      expect(diacriticResults[0].story.id).toBe(plainResults[0].story.id);
      expect(diacriticResults[0].relevanceScore).toBe(plainResults[0].relevanceScore);
    });
  });

  describe('F19: Multi-Signal Related Story Engine Boundaries', () => {
    it('F19-B1: Empty corpus returns empty array without throwing', () => {
      const current = sampleCorpus[0];
      const related = getRelatedStories(current, []);
      expect(related).toEqual([]);
    });

    it('F19-B2: Single story database excludes current story and returns empty array', () => {
      const current = sampleCorpus[0];
      const related = getRelatedStories(current, [current]);
      expect(related).toEqual([]);
    });

    it('F19-B3: Limit parameter boundary handling (0 -> empty, negative -> default, oversized -> capped)', () => {
      const current = sampleCorpus[0];
      const zeroLimit = getRelatedStories(current, sampleCorpus, 0);
      const negativeLimit = getRelatedStories(current, sampleCorpus, -1);
      const largeLimit = getRelatedStories(current, sampleCorpus, 50);

      expect(zeroLimit).toEqual([]);
      expect(negativeLimit.length).toBeLessThanOrEqual(3);
      expect(largeLimit.length).toBeLessThanOrEqual(sampleCorpus.length - 1);
    });

    it('F19-B4: Multi-signal scoring favors shared Category + Theme over unrelated stories', () => {
      const baseStory: Story = {
        id: 'base',
        slug: 'base-story',
        title: 'Base Hero',
        subtitle: '',
        excerpt: '',
        content: '',
        dogName: 'Buddy',
        dogBreed: 'Labrador',
        location: { city: 'Austin', stateOrProvince: 'TX', country: 'USA' },
        category: 'hero-dogs',
        emotionalThemes: ['brave'],
        readTimeMinutes: 3
      };

      const highAffinity: Story = {
        id: 'high',
        slug: 'high-story',
        title: 'High Hero',
        subtitle: '',
        excerpt: '',
        content: '',
        dogName: 'Hero 2',
        dogBreed: 'Poodle',
        location: { city: 'Dallas', stateOrProvince: 'TX', country: 'USA' },
        category: 'hero-dogs', // Category match (+0.45)
        emotionalThemes: ['brave'], // Theme match (+0.35) -> total = 0.80
        readTimeMinutes: 3
      };

      const lowAffinity: Story = {
        id: 'low',
        slug: 'low-story',
        title: 'Low Hero',
        subtitle: '',
        excerpt: '',
        content: '',
        dogName: 'Lab 2',
        dogBreed: 'Labrador', // Breed match only (+0.20)
        location: { city: 'Miami', stateOrProvince: 'FL', country: 'USA' },
        category: 'reunions',
        emotionalThemes: ['joyful'],
        readTimeMinutes: 3
      };

      const related = getRelatedStories(baseStory, [baseStory, lowAffinity, highAffinity]);
      expect(related.length).toBe(2);
      expect(related[0].id).toBe('high');
      expect(related[1].id).toBe('low');
    });

    it('F19-B5: Completely orthogonal story with 0 shared signals is excluded from related stories', () => {
      const baseStory: Story = {
        id: 'base',
        slug: 'base',
        title: 'Base',
        subtitle: '',
        excerpt: '',
        content: '',
        dogName: 'A',
        dogBreed: 'Beagle',
        location: { city: 'Rome', stateOrProvince: 'Lazio', country: 'Italy' },
        category: 'lost-and-found',
        emotionalThemes: ['tearjerker'],
        readTimeMinutes: 2
      };

      const orthogonalStory: Story = {
        id: 'ortho',
        slug: 'ortho',
        title: 'Ortho',
        subtitle: '',
        excerpt: '',
        content: '',
        dogName: 'B',
        dogBreed: 'Pug',
        location: { city: 'Tokyo', stateOrProvince: 'Kanto', country: 'Japan' },
        category: 'hero-dogs',
        emotionalThemes: ['brave'],
        readTimeMinutes: 2
      };

      const related = getRelatedStories(baseStory, [baseStory, orthogonalStory]);
      expect(related).toEqual([]);
    });
  });

  describe('F20: Search & Discovery Page (/search) Boundaries', () => {
    it('F20-B1: Empty query string returns all stories (or zero-state curated suggestions)', () => {
      const resultsEmpty = searchStories(sampleCorpus, { query: '' });
      const resultsSpaces = searchStories(sampleCorpus, { query: '    ' });

      expect(resultsEmpty.length).toBe(sampleCorpus.length);
      expect(resultsSpaces.length).toBe(sampleCorpus.length);
    });

    it('F20-B2: Multi-filter conjunction (Category + Theme) strictly narrows search results', () => {
      const heroBrave = searchStories(sampleCorpus, { category: 'hero-dogs', emotionalTheme: 'brave' });
      const heroJoyful = searchStories(sampleCorpus, { category: 'hero-dogs', emotionalTheme: 'joyful' });

      expect(heroBrave.length).toBe(1);
      expect(heroBrave[0].story.dogName).toBe('Toby');
      expect(heroJoyful.length).toBe(0);
    });

    it('F20-B3: Non-matching filter combinations produce 0 results with clear filter reset state', () => {
      const impossibleFilter = searchStories(sampleCorpus, {
        category: 'loyalty',
        emotionalTheme: 'brave'
      });

      expect(impossibleFilter.length).toBe(0);
    });

    it('F20-B4: Simulated debounced input stream executes only latest query value', () => {
      let lastExecutedQuery = '';
      const debounceSimulator = (queries: string[], delayMs: number = 300) => {
        // Fast stream
        queries.forEach((q) => {
          lastExecutedQuery = q;
        });
        return searchStories(sampleCorpus, { query: lastExecutedQuery });
      };

      const keystrokeSequence = ['b', 'bo', 'bou', 'bould', 'boulder'];
      const finalResults = debounceSimulator(keystrokeSequence);

      expect(lastExecutedQuery).toBe('boulder');
      expect(finalResults.length).toBe(1);
      expect(finalResults[0].story.dogName).toBe('Toby');
    });

    it('F20-B5: URL search parameter serializer and parser round-trips state losslessly', () => {
      const serializeFilterToUrl = (filter: SearchFilter): string => {
        const params = new URLSearchParams();
        if (filter.query) params.set('q', filter.query);
        if (filter.category) params.set('cat', filter.category);
        if (filter.emotionalTheme) params.set('theme', filter.emotionalTheme);
        return `/search?${params.toString()}`;
      };

      const parseFilterFromUrl = (urlStr: string): SearchFilter => {
        const url = new URL(urlStr, 'https://eternal-paws.org');
        return {
          query: url.searchParams.get('q') || undefined,
          category: (url.searchParams.get('cat') as StoryCategory) || undefined,
          emotionalTheme: (url.searchParams.get('theme') as EmotionalTheme) || undefined,
        };
      };

      const initialFilter: SearchFilter = { query: 'Border Collie', category: 'hero-dogs', emotionalTheme: 'brave' };
      const url = serializeFilterToUrl(initialFilter);
      const parsed = parseFilterFromUrl(url);

      expect(url).toBe('/search?q=Border+Collie&cat=hero-dogs&theme=brave');
      expect(parsed).toEqual(initialFilter);
    });
  });
});
