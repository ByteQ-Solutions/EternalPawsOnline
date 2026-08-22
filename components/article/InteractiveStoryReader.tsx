'use client';

import React, { useState, useCallback } from 'react';
import { Story } from '@/domain/types';
import { ArticleHeader } from './ArticleHeader';
import { OptimizedDogImage } from './OptimizedDogImage';
import { ShareBar } from './ShareBar';
import { ArticleContent } from './ArticleContent';
import { AudioNarrationPlayer } from './AudioNarrationPlayer';
import { StoryLanguageBar } from './StoryLanguageBar';

export interface InteractiveStoryReaderProps {
  story: Story;
}

interface TranslatedStoryState {
  title: string;
  excerpt: string;
  content: string;
}

export const InteractiveStoryReader: React.FC<InteractiveStoryReaderProps> = ({ story }) => {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationsCache, setTranslationsCache] = useState<Record<string, TranslatedStoryState>>({
    en: {
      title: story.title,
      excerpt: story.excerpt,
      content: story.content,
    },
  });

  const activeStoryState = translationsCache[currentLang] || {
    title: story.title,
    excerpt: story.excerpt,
    content: story.content,
  };

  const handleLanguageChange = useCallback(async (langCode: string) => {
    if (langCode === currentLang) return;

    if (translationsCache[langCode]) {
      setCurrentLang(langCode);
      return;
    }

    setIsTranslating(true);
    try {
      const res = await fetch('/api/stories/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: story.title,
          excerpt: story.excerpt,
          content: story.content,
          targetLang: langCode,
        }),
      });

      const data = await res.json();
      if (data.success && data.translatedContent) {
        const newState: TranslatedStoryState = {
          title: data.translatedTitle || story.title,
          excerpt: data.translatedExcerpt || story.excerpt,
          content: data.translatedContent,
        };
        setTranslationsCache((prev) => ({ ...prev, [langCode]: newState }));
        setCurrentLang(langCode);
      }
    } catch (err) {
      console.warn('Language translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  }, [currentLang, story.title, story.excerpt, story.content, translationsCache]);

  const dynamicStory: Story = {
    ...story,
    title: activeStoryState.title,
    excerpt: activeStoryState.excerpt,
    content: activeStoryState.content,
  };

  return (
    <>
      {/* Editorial Article Masthead */}
      <ArticleHeader story={dynamicStory} />

      {/* Multi-Language Instant AI Translation Strip */}
      <StoryLanguageBar
        currentLang={currentLang}
        isTranslating={isTranslating}
        onLanguageChange={handleLanguageChange}
      />

      {/* Audio Story Narration Player (with Adam-style Calm Voice) */}
      <AudioNarrationPlayer
        storyTitle={activeStoryState.title}
        storyContent={activeStoryState.content}
        dogName={story.dogName}
      />

      {/* Hero Media with Zero-CLS aspect ratio and AI disclosure */}
      <OptimizedDogImage
        image={story.heroImage}
        priority={true}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
        containerClassName="my-6 sm:my-8"
      />

      {/* Social Sharing Bar (Top) */}
      <ShareBar
        url={`/stories/${story.slug}`}
        title={activeStoryState.title}
        excerpt={activeStoryState.excerpt}
        dogName={story.dogName}
        className="my-4"
      />

      {/* Main Story Narrative Body with Active Language Translation */}
      <div id="article-body" className="my-8 transition-opacity duration-300">
        <ArticleContent content={activeStoryState.content} enableDropCap={true} />
      </div>
    </>
  );
};

export default InteractiveStoryReader;
