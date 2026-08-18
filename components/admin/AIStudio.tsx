'use client';

/**
 * Eternal Paws Platform - AI Editorial Studio Component
 * Path: components/admin/AIStudio.tsx
 * 
 * Multi-Provider AI Hub supporting TokenRouter (DeepSeek v4 / Qwen 3.8 Max),
 * OpenRouter, Groq, and OpenAI.
 */

import React, { useState } from 'react';
import { Sparkles, Wand2, Copy, Check, RefreshCw, BookOpen, AlertCircle, FileText, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Card, CardContent } from '@/design-system/components/Card';
import { GeneratedStoryDraft } from '@/lib/ai/ai-service';

export const AIStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'polish' | 'generate'>('polish');

  // Polish State
  const [rawText, setRawText] = useState('');
  const [dogName, setDogName] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedOutput, setPolishedOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Generator State
  const [topic, setTopic] = useState('');
  const [genDogName, setGenDogName] = useState('');
  const [genBreed, setGenBreed] = useState('');
  const [genLocation, setGenLocation] = useState('');
  const [genCategory, setGenCategory] = useState('rescues');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedStoryDraft | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
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
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-borderLight rounded-2xl p-6 shadow-soft space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderLight pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-goldAccent" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary">
              AI Editorial Assistant Studio
            </h2>
            <Badge variant="forest" size="sm" className="font-mono text-[10px]">
              DeepSeek v4 / Qwen 3.8
            </Badge>
          </div>
          <p className="text-xs text-inkMuted mt-1">
            OpenAI-Compatible Gateway (TokenRouter / OpenRouter) • Hot-swappable via environment variables.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-cardMuted border border-borderLight rounded-xl p-1">
          <button
            type="button"
            onClick={() => setActiveTab('polish')}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'polish'
                ? 'bg-forestPrimary text-white shadow-soft'
                : 'text-inkMuted hover:text-inkPrimary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Story Polisher
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'generate'
                ? 'bg-forestPrimary text-white shadow-soft'
                : 'text-inkMuted hover:text-inkPrimary'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" /> Auto-Draft Generator
          </button>
        </div>
      </div>

      {errorMsg && (
        <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-error font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: STORY POLISHER */}
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

      {/* TAB 2: STORY DRAFT GENERATOR */}
      {activeTab === 'generate' && (
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
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!topic.trim()}
              className="min-h-[44px] font-bold text-xs"
            >
              <Wand2 className="w-4 h-4 mr-1.5" /> Build Full Story Draft
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
