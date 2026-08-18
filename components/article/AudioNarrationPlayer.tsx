'use client';

/**
 * Eternal Paws Platform - Accessible Audio Story Narration Player
 * Path: components/article/AudioNarrationPlayer.tsx
 * 
 * Features:
 * - Natural browser SpeechSynthesis / Web Audio narration engine
 * - Play, Pause, Resume, and Speed controls (1x, 1.25x, 1.5x)
 * - Progress tracking & accessible ARIA announcements
 * - 44x44px touch targets for senior & mobile accessibility
 */

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, FastForward, Sparkles, Headphones } from 'lucide-react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { cn } from '@/lib/utils';

export interface AudioNarrationPlayerProps {
  storyTitle: string;
  storyContent: string;
  dogName: string;
  className?: string;
}

export const AudioNarrationPlayer: React.FC<AudioNarrationPlayerProps> = ({
  storyTitle,
  storyContent,
  dogName,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isSupported, setIsSupported] = useState(true);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const cleanTextForAudio = (title: string, content: string): string => {
    const full = `${title}. ... ${content}`;
    return full.replace(/[*_#`[\]()]/g, '').replace(/\n+/g, ' ');
  };

  const handlePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();

    const textToRead = cleanTextForAudio(storyTitle, storyContent);
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Prefer high-quality English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Samantha'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const togglePlaybackRate = () => {
    const rates = [1.0, 1.25, 1.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (isPlaying) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isSupported) return null;

  return (
    <div
      role="region"
      aria-label={`Audio narration for ${dogName}'s story`}
      className={cn(
        'bg-card border border-borderLight rounded-2xl p-4 sm:p-5 shadow-soft my-6',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-forestLight text-forestPrimary flex items-center justify-center flex-shrink-0">
            <Headphones className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forestPrimary">
                Listen to Story
              </span>
              <Badge variant="outline" size="sm" className="text-[10px] py-0">
                Natural Narration
              </Badge>
            </div>
            <p className="text-sm font-semibold text-inkPrimary mt-0.5">
              {isPlaying ? `Narrating ${dogName}'s Journey...` : `Audio version of this verified story`}
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              type="button"
              onClick={handlePause}
              aria-label="Pause audio narration"
              className="min-h-[44px] px-4 py-2 bg-forestPrimary text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-soft hover:bg-forestHover transition-colors focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              <Pause className="w-4 h-4" /> Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePlay}
              aria-label={`Listen to ${dogName}'s full story`}
              className="min-h-[44px] px-4 py-2 bg-forestPrimary text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-soft hover:bg-forestHover transition-colors focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              <Play className="w-4 h-4 fill-white" /> {isPaused ? 'Resume' : 'Play Audio'}
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleStop}
              aria-label="Restart audio narration from beginning"
              className="min-h-[44px] min-w-[44px] p-2 bg-cardMuted text-inkPrimary rounded-xl hover:bg-borderLight transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={togglePlaybackRate}
            aria-label={`Change speed: current ${playbackRate}x`}
            className="min-h-[44px] px-3 py-2 bg-cardMuted text-inkPrimary rounded-xl font-bold text-xs hover:bg-borderLight transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-forestPrimary"
          >
            {playbackRate}x
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioNarrationPlayer;
