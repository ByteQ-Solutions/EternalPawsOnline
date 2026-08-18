'use client';

/**
 * Eternal Paws Platform - AI Editorial Assistant Studio
 * Path: components/admin/AIStudio.tsx
 * 
 * Multi-Provider AI Hub supporting TokenRouter (DeepSeek v4 / Qwen 3.8 Max),
 * OpenRouter, Groq, and OpenAI.
 * 
 * Features:
 * 1. 🌟 Unique Story Engine with Anti-Duplication Collision Shield
 * 2. ✨ Story Polisher (Grammar, Rhythm, Tone)
 * 3. 🚀 1-Click Story Generator from News Links/Prompts
 * 4. ⚡ Direct One-Click Publish to Live Database
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Globe,
  ExternalLink,
  Dice5,
  AlertCircle,
  Clock,
  MapPin,
  Send,
  Upload,
  Image as ImageIcon,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { UniqueStoryPayload, GeneratedStoryDraft } from '@/lib/ai/ai-service';

export const AIStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'unique' | 'polish' | 'draft'>('unique');

  // Unique Story Engine State
  const [uniqueCategory, setUniqueCategory] = useState<string>('any');
  const [themePrompt, setThemePrompt] = useState<string>('');
  const [isGeneratingUnique, setIsGeneratingUnique] = useState<boolean>(false);
  const [generatedUniqueStory, setGeneratedUniqueStory] = useState<UniqueStoryPayload | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  // Polish State
  const [rawText, setRawText] = useState('');
  const [dogName, setDogName] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedOutput, setPolishedOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Draft Generator State
  const [topic, setTopic] = useState('');
  const [genDogName, setGenDogName] = useState('');
  const [genBreed, setGenBreed] = useState('');
  const [genLocation, setGenLocation] = useState('');
  const [genCategory, setGenCategory] = useState('rescues');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedStoryDraft | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Handle Unique Story Generation
  const handleGenerateUnique = async () => {
    setIsGeneratingUnique(true);
    setErrorMsg(null);
    setPublishedUrl(null);

    try {
      const res = await fetch('/api/admin/ai/generate-unique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: uniqueCategory === 'any' ? undefined : uniqueCategory,
          themePrompt: themePrompt.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.story) {
        setGeneratedUniqueStory(data.story);
      } else {
        setErrorMsg(data.error || 'Failed to generate unique story.');
      }
    } catch {
      setErrorMsg('Network error while generating unique story.');
    } finally {
      setIsGeneratingUnique(false);
    }
  };

  // 2. Handle Unique Story Custom Photo Upload
  const handleUniquePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !generatedUniqueStory) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setGeneratedUniqueStory({
        ...generatedUniqueStory,
        heroImage: {
          ...generatedUniqueStory.heroImage,
          url: dataUrl,
          altText: `Photo of ${generatedUniqueStory.dogName} - ${generatedUniqueStory.title}`,
          credit: 'Uploaded Photo (Admin Archive)',
        },
      });
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  // 3. Handle 1-Click Publish to Database
  const handlePublishUnique = async () => {
    if (!generatedUniqueStory) return;
    setIsPublishing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/stories/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedUniqueStory),
      });

      const data = await res.json();
      if (data.success) {
        setPublishedUrl(data.liveUrl || `/stories/${generatedUniqueStory.slug}`);
      } else {
        setErrorMsg(data.error || 'Failed to publish story to live database.');
      }
    } catch {
      setErrorMsg('Network error while publishing story.');
    } finally {
      setIsPublishing(false);
    }
  };

  // 3. Handle Story Polisher
  const handlePolish = async () => {
    if (!rawText.trim()) return;
    setIsPolishing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText, dogName }),
      });
      const data = await res.json();
      if (data.success) {
        setPolishedOutput(data.polishedText);
      } else {
        setErrorMsg(data.error || 'Failed to polish story narrative.');
      }
    } catch {
      setErrorMsg('Network error while contacting AI Gateway.');
    } finally {
      setIsPolishing(false);
    }
  };

  // 4. Handle Draft Builder
  const handleGenerateDraft = async () => {
    if (!topic.trim()) return;
    setIsGeneratingDraft(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          dogName: genDogName,
          dogBreed: genBreed,
          location: genLocation,
          category: genCategory,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedDraft(data.draft);
      } else {
        setErrorMsg(data.error || 'Failed to generate story draft.');
      }
    } catch {
      setErrorMsg('Network error while generating story.');
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-borderLight rounded-2xl p-6 shadow-soft space-y-6">
      {/* Studio Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-borderLight pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-goldAccent" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary">
              AI Editorial Assistant Studio
            </h2>
            <Badge variant="forest" size="sm" className="font-mono text-[10px]">
              DeepSeek v4 / Qwen 3.8 Max
            </Badge>
          </div>
          <p className="text-xs text-inkMuted mt-1">
            OpenAI-Compatible Gateway • Automatic Anti-Duplication Shield Active.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-cardMuted border border-borderLight rounded-xl p-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('unique')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'unique'
                ? 'bg-forestPrimary text-white shadow-soft'
                : 'text-inkMuted hover:text-inkPrimary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-goldLight" /> 100% Unique Story Generator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('polish')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'polish'
                ? 'bg-forestPrimary text-white shadow-soft'
                : 'text-inkMuted hover:text-inkPrimary'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" /> Story Polisher
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('draft')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'draft'
                ? 'bg-forestPrimary text-white shadow-soft'
                : 'text-inkMuted hover:text-inkPrimary'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Draft Builder
          </button>
        </div>
      </div>

      {errorMsg && (
        <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-error font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: 100% UNIQUE STORY GENERATOR WITH ANTI-DUPLICATION SHIELD */}
      {activeTab === 'unique' && (
        <div className="space-y-5">
          <div className="bg-forestLight/40 border border-forestPrimary/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-forestPrimary flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-forestPrimary uppercase tracking-wider block">
                  Anti-Duplication Collision Shield Active
                </span>
                <p className="text-xs text-inkMuted">
                  Scans existing story corpus to guarantee 100% unique dog personas, plots, locations, and verification sources.
                </p>
              </div>
            </div>
            <Badge variant="verified" size="sm">
              🛡️ Zero-Duplicate Guarantee
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="unique-cat" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Story Category
              </label>
              <select
                id="unique-cat"
                value={uniqueCategory}
                onChange={(e) => setUniqueCategory(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              >
                <option value="any">🎲 Surprise Me (Any Category)</option>
                <option value="rescues">Rescues</option>
                <option value="hero-dogs">Hero Dogs</option>
                <option value="reunions">Reunions</option>
                <option value="survival">Survival</option>
                <option value="loyalty">Loyalty</option>
                <option value="lost-and-found">Lost & Found</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="unique-prompt" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Optional Theme / Setting Prompt
              </label>
              <input
                id="unique-prompt"
                type="text"
                value={themePrompt}
                onChange={(e) => setThemePrompt(e.target.value)}
                placeholder="e.g. Coastal search dog during storm, senior dog adopted by veteran, shelter reunion..."
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={handleGenerateUnique}
              isLoading={isGeneratingUnique}
              className="min-h-[44px] font-bold text-xs shadow-soft"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-goldLight" /> Generate 100% Unique Story
            </Button>
          </div>

          {/* Generated Story Live Preview & 1-Click Publish */}
          {generatedUniqueStory && (
            <div className="mt-6 p-6 bg-cardMuted/70 border border-borderLight rounded-2xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLight/80 pb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="forest" size="sm">
                    ✨ 100% Unique Story Ready
                  </Badge>
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Duplicate Check Passed
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(JSON.stringify(generatedUniqueStory, null, 2))}
                    className="min-h-[36px] px-3 py-1 bg-card border border-borderLight rounded-lg text-xs font-bold text-inkPrimary hover:bg-canvas transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied JSON!' : 'Copy Data'}
                  </button>

                  <Button
                    type="button"
                    variant="primary"
                    onClick={handlePublishUnique}
                    isLoading={isPublishing}
                    className="min-h-[36px] px-4 text-xs font-bold"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Publish to Live Site
                  </Button>
                </div>
              </div>

              {publishedUrl && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-semibold">
                  <span>🎉 Story successfully published live!</span>
                  <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-forestPrimary underline font-bold"
                  >
                    View Live Article <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Story Details Card */}
              <div className="space-y-4 bg-canvas p-5 rounded-xl border border-borderLight">
                {/* Hero Photo Preview & Upload Control */}
                <div className="p-4 bg-card rounded-xl border border-borderLight flex flex-col sm:flex-row items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={generatedUniqueStory.heroImage.url}
                    alt={generatedUniqueStory.heroImage.altText || generatedUniqueStory.dogName}
                    className="w-full sm:w-36 h-28 object-cover rounded-lg border border-borderLight shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <ImageIcon className="w-4 h-4 text-forestPrimary flex-shrink-0" />
                      <span className="text-xs font-bold text-inkPrimary uppercase tracking-wider">
                        Story Hero Photograph
                      </span>
                    </div>
                    <p className="text-xs text-inkMuted truncate">
                      {generatedUniqueStory.heroImage.credit || 'Editorial Photograph'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <label
                        htmlFor="unique-photo-upload"
                        className="min-h-[36px] px-3 py-1.5 bg-forestPrimary text-white text-xs font-bold rounded-lg shadow-soft inline-flex items-center gap-1.5 cursor-pointer hover:bg-forestDark transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" /> Upload Custom Photo
                        <input
                          id="unique-photo-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleUniquePhotoUpload}
                          className="sr-only"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const url = window.prompt('Enter Image URL for this story:', generatedUniqueStory.heroImage.url);
                          if (url && url.trim()) {
                            setGeneratedUniqueStory({
                              ...generatedUniqueStory,
                              heroImage: { ...generatedUniqueStory.heroImage, url: url.trim() },
                            });
                          }
                        }}
                        className="min-h-[36px] px-3 py-1.5 bg-card border border-borderLight text-inkPrimary text-xs font-bold rounded-lg hover:bg-cardMuted transition-colors"
                      >
                        Edit Image URL
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-inkSubtle">
                  <Badge variant="outline" size="sm">
                    {generatedUniqueStory.category.toUpperCase()}
                  </Badge>
                  <span>•</span>
                  <span className="font-bold text-inkPrimary">
                    {generatedUniqueStory.dogName} ({generatedUniqueStory.dogBreed})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {generatedUniqueStory.location.city}, {generatedUniqueStory.location.stateOrProvince}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary">
                  {generatedUniqueStory.title}
                </h3>
                <p className="text-xs text-inkMuted italic">
                  &ldquo;{generatedUniqueStory.excerpt}&rdquo;
                </p>

                <div className="pt-3 border-t border-borderLight/80 font-serif text-sm leading-relaxed text-inkPrimary whitespace-pre-line">
                  {generatedUniqueStory.content}
                </div>

                {/* Sources Attribution Preview */}
                <div className="mt-4 pt-3 border-t border-borderLight/60 text-xs text-inkSubtle space-y-1">
                  <span className="font-bold uppercase tracking-wider block text-inkPrimary">
                    Verified Sources:
                  </span>
                  {generatedUniqueStory.verification.sources.map((src, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-emerald-800 font-semibold">• {src.name}</span>
                      <span>({src.documentReference})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STORY POLISHER */}
      {activeTab === 'polish' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label htmlFor="polish-dog-name" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Dog Name (Optional)
              </label>
              <input
                id="polish-dog-name"
                type="text"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                placeholder="e.g. Bella"
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="polish-raw-text" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Raw Story Narrative or Reader Submission
              </label>
              <textarea
                id="polish-raw-text"
                rows={4}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste raw submission or draft narrative here to fix grammar, emotional flow, and storytelling pacing..."
                className="w-full p-3 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary resize-y"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={handlePolish}
              isLoading={isPolishing}
              disabled={!rawText.trim()}
              className="min-h-[44px] font-bold text-xs"
            >
              <Sparkles className="w-4 h-4 mr-1.5" /> Polish Story with DeepSeek
            </Button>
          </div>

          {polishedOutput && (
            <div className="mt-4 p-5 bg-cardMuted/80 border border-borderLight rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-forestPrimary flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-800" /> Polished Narrative Output
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(polishedOutput)}
                  className="min-h-[36px] px-3 py-1 bg-card border border-borderLight rounded-lg text-xs font-bold text-inkPrimary hover:bg-canvas transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Narrative'}
                </button>
              </div>

              <div className="p-4 bg-canvas rounded-xl border border-borderLight/80 text-sm leading-relaxed text-inkPrimary whitespace-pre-line font-serif">
                {polishedOutput}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STORY DRAFT GENERATOR FROM TOPIC */}
      {activeTab === 'draft' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="gen-dog-name" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Dog Name
              </label>
              <input
                id="gen-dog-name"
                type="text"
                value={genDogName}
                onChange={(e) => setGenDogName(e.target.value)}
                placeholder="e.g. Toby"
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>
            <div>
              <label htmlFor="gen-breed" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Breed
              </label>
              <input
                id="gen-breed"
                type="text"
                value={genBreed}
                onChange={(e) => setGenBreed(e.target.value)}
                placeholder="e.g. German Shepherd"
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>
            <div>
              <label htmlFor="gen-location" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Location
              </label>
              <input
                id="gen-location"
                type="text"
                value={genLocation}
                onChange={(e) => setGenLocation(e.target.value)}
                placeholder="e.g. Austin, Texas"
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>
            <div>
              <label htmlFor="gen-category" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Category Hub
              </label>
              <select
                id="gen-category"
                value={genCategory}
                onChange={(e) => setGenCategory(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              >
                <option value="rescues">Rescues</option>
                <option value="hero-dogs">Hero Dogs</option>
                <option value="reunions">Reunions</option>
                <option value="survival">Survival</option>
                <option value="loyalty">Loyalty</option>
                <option value="lost-and-found">Lost & Found</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="gen-topic" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
              News Summary, Web Link, or Incident Details
            </label>
            <textarea
              id="gen-topic"
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Dog alerted family to house fire at 3 AM and led firefighters to baby's bedroom in Austin TX..."
              className="w-full p-3 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary resize-y"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={handleGenerateDraft}
              isLoading={isGeneratingDraft}
              disabled={!topic.trim()}
              className="min-h-[44px] font-bold text-xs"
            >
              <Wand2 className="w-4 h-4 mr-1.5" /> Build Story Draft
            </Button>
          </div>

          {generatedDraft && (
            <div className="mt-4 p-5 bg-cardMuted/80 border border-borderLight rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="forest" size="sm">
                  ✨ Generated Editorial Draft
                </Badge>
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(generatedDraft, null, 2))}
                  className="min-h-[36px] px-3 py-1 bg-card border border-borderLight rounded-lg text-xs font-bold text-inkPrimary hover:bg-canvas transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied JSON!' : 'Copy Full Draft'}
                </button>
              </div>

              <div className="space-y-2 bg-canvas p-4 rounded-xl border border-borderLight/80">
                <h3 className="font-serif text-lg font-bold text-inkPrimary">
                  {generatedDraft.title}
                </h3>
                <p className="text-xs text-inkMuted italic">
                  &ldquo;{generatedDraft.excerpt}&rdquo;
                </p>
                <div className="pt-2 border-t border-borderLight font-serif text-sm leading-relaxed text-inkPrimary whitespace-pre-line">
                  {generatedDraft.content}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIStudio;
