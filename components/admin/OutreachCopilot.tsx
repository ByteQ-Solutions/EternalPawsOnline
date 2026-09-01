'use client';

import React, { useState } from 'react';
import {
  Link2,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Search,
  HelpCircle,
  ShieldCheck,
  Send,
  AlertCircle,
  RefreshCw,
  Share2,
  Globe,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';

export type OutreachPlatform = 'reddit' | 'quora' | 'shelter_email' | 'social_dm';

interface MatchedAsset {
  type: string;
  title: string;
  url: string;
  summary: string;
}

interface GeneratedResult {
  matchedAsset: MatchedAsset;
  platform: OutreachPlatform;
  fullAnswer: string;
  shortAnswer: string;
  keyAdvice: string;
  targetKeywords: string[];
}

const SAMPLE_PROMPTS = [
  {
    emoji: '🍫',
    label: 'Chocolate Ingestion',
    prompt: 'My 35lb Golden Retriever just ate half a bar of 70% dark chocolate about 45 mins ago. Should I induce vomiting or what should I do?',
  },
  {
    emoji: '🍉',
    label: 'Watermelon & Fruit Safety',
    prompt: 'Can dogs safely eat fresh watermelon? Do I need to remove all the black seeds and the rind before giving it to my puppy?',
  },
  {
    emoji: '🧠',
    label: 'Dog Leaning Behavior',
    prompt: 'Why does my rescue dog always lean his full body weight against my legs whenever I sit or stand in the kitchen?',
  },
  {
    emoji: '🦴',
    label: 'Senior Dog Arthritis Care',
    prompt: 'What are the best natural supplements or foods with Omega-3s to help an aging 10-year-old Labrador with stiff joints?',
  },
  {
    emoji: '🏡',
    label: 'Shelter Adopter Guide Outreach',
    prompt: 'Looking to introduce our free vet-reviewed Canine Food Safety Directory & Chocolate Calculator to a local animal rescue shelter.',
  },
];

export const OutreachCopilot: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [platform, setPlatform] = useState<OutreachPlatform>('reddit');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedResult | null>(null);

  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleGenerate = async () => {
    if (!question.trim() || question.trim().length < 5) {
      setErrorMsg('Please enter a question or forum prompt (at least 5 characters).');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/ai/outreach-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, platform }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        setErrorMsg(data.error || 'Failed to generate answer.');
      }
    } catch {
      setErrorMsg('Network error while generating outreach answer.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'full' | 'short' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'full') {
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2500);
    } else if (type === 'short') {
      setCopiedShort(true);
      setTimeout(() => setCopiedShort(false), 2500);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-card border border-borderLight rounded-3xl shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-bold uppercase tracking-wider">
              <Link2 className="w-3.5 h-3.5" />
              <span>White-Hat Backlink & Community Outreach Engine</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
              Reddit, Quora & Shelter Q&A Answer Copilot
            </h2>
            <p className="text-xs sm:text-sm text-inkMuted max-w-2xl">
              Paste any dog owner question from Reddit, Quora, or Shelter inquiries. The AI matches our 78+ site assets and writes a 100% human, non-spammy authority response citing the exact link.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="forest" size="md">
              78+ Assets Indexed
            </Badge>
          </div>
        </div>

        {/* 1-Click Quick Fill Samples */}
        <div className="pt-2 border-t border-borderLight/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-inkSubtle block mb-2">
            1-Click Sample Questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuestion(s.prompt)}
                className="px-3 py-1.5 rounded-xl bg-canvas hover:bg-forestLight/60 border border-borderLight text-xs font-semibold text-inkPrimary transition-all flex items-center gap-1.5 hover:border-forestPrimary/40 cursor-pointer shadow-2xs"
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs (6 Cols) */}
        <div className="lg:col-span-6 bg-card border border-borderLight rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft">
          {/* Platform Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-inkSubtle">
              1. Select Target Platform & Tone
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPlatform('reddit')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  platform === 'reddit'
                    ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-xs'
                    : 'border-borderLight bg-canvas hover:bg-cardMuted'
                }`}
              >
                <span className="text-xl">🟠</span>
                <div>
                  <span className="font-bold text-xs text-inkPrimary block">Reddit</span>
                  <span className="text-[10px] text-inkMuted">Helpful & Conversational</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('quora')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  platform === 'quora'
                    ? 'border-red-600 bg-red-50/60 ring-2 ring-red-600/20 shadow-xs'
                    : 'border-borderLight bg-canvas hover:bg-cardMuted'
                }`}
              >
                <span className="text-xl">🔴</span>
                <div>
                  <span className="font-bold text-xs text-inkPrimary block">Quora</span>
                  <span className="text-[10px] text-inkMuted">Detailed & Authoritative</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('shelter_email')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  platform === 'shelter_email'
                    ? 'border-forestPrimary bg-forestLight/60 ring-2 ring-forestPrimary/20 shadow-xs'
                    : 'border-borderLight bg-canvas hover:bg-cardMuted'
                }`}
              >
                <span className="text-xl">🏠</span>
                <div>
                  <span className="font-bold text-xs text-inkPrimary block">Shelter Email</span>
                  <span className="text-[10px] text-inkMuted">Polite Partnership Pitch</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('social_dm')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  platform === 'social_dm'
                    ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-borderLight bg-canvas hover:bg-cardMuted'
                }`}
              >
                <span className="text-xl">💬</span>
                <div>
                  <span className="font-bold text-xs text-inkPrimary block">Social DM</span>
                  <span className="text-[10px] text-inkMuted">Short & Punchy (&lt;60w)</span>
                </div>
              </button>
            </div>
          </div>

          {/* Question Input */}
          <div className="space-y-2">
            <label htmlFor="outreach-question" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle">
              2. Paste Dog Owner Question or Topic
            </label>
            <textarea
              id="outreach-question"
              rows={6}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Paste the Reddit thread, Quora question, or shelter inquiry here..."
              className="w-full p-4 bg-canvas border border-borderLight rounded-2xl text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-forestPrimary resize-y shadow-2xs"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            isLoading={isLoading}
            className="w-full min-h-[48px] rounded-2xl font-bold text-sm shadow-soft cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2 text-goldLight" />
            {isLoading ? 'Synthesizing Authority Answer...' : '✨ Generate Answer & Auto-Match Link'}
          </Button>

          {/* Live Platform Search Helpers */}
          <div className="pt-4 border-t border-borderLight/60 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-inkSubtle block">
              Find Live Threads to Answer (Google Dorks):
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href="https://www.google.com/search?q=site:reddit.com/r/dogs+%22can+dogs+eat%22"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-canvas border border-borderLight rounded-xl font-bold text-inkPrimary hover:text-orange-600 inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Reddit Food Threads</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.google.com/search?q=site:quora.com+%22why+does+my+dog%22"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-canvas border border-borderLight rounded-xl font-bold text-inkPrimary hover:text-red-600 inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Quora Behavior Qs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.google.com/search?q=inurl:resources+%22dog%22+%22toxic+foods%22+site:.org"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-canvas border border-borderLight rounded-xl font-bold text-inkPrimary hover:text-forestPrimary inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>.org Shelter Resources</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Output: Matched Asset & Ready-to-Post Answers (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Matched Asset Card */}
              <div className="p-5 bg-forestLight/50 border-2 border-forestPrimary/30 rounded-3xl space-y-3 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forestPrimary flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Auto-Matched Eternal Paws Asset
                  </span>
                  <Badge variant="forest" size="sm" className="capitalize text-[10px]">
                    {result.matchedAsset.type.replace('_', ' ')}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-inkPrimary">
                    {result.matchedAsset.title}
                  </h4>
                  <p className="text-xs text-inkMuted mt-0.5 line-clamp-2">
                    {result.matchedAsset.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-forestPrimary/20 text-xs">
                  <a
                    href={result.matchedAsset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-forestPrimary hover:underline truncate"
                  >
                    {result.matchedAsset.url}
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(result.matchedAsset.url, 'url')}
                    className="px-2.5 py-1 bg-white border border-forestPrimary/30 rounded-lg text-[11px] font-bold text-forestPrimary hover:bg-forestLight transition-colors shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>

              {/* Full Answer Card */}
              <div className="p-6 bg-card border border-borderLight rounded-3xl space-y-4 shadow-soft">
                <div className="flex items-center justify-between border-b border-borderLight pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-forestPrimary" />
                    <span className="font-serif font-bold text-sm text-inkPrimary">
                      Ready-to-Post Full Response ({result.platform.toUpperCase()})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(result.fullAnswer, 'full')}
                    className="px-3 py-1.5 bg-forestPrimary hover:bg-forestHover text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-soft cursor-pointer"
                  >
                    {copiedFull ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFull ? 'Copied to Clipboard!' : 'Copy Full Answer'}</span>
                  </button>
                </div>

                <div className="p-4 bg-canvas border border-borderLight/80 rounded-2xl text-xs sm:text-sm font-sans leading-relaxed text-inkPrimary whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {result.fullAnswer}
                </div>
              </div>

              {/* Short Version Card */}
              <div className="p-5 bg-card border border-borderLight rounded-3xl space-y-3 shadow-soft">
                <div className="flex items-center justify-between border-b border-borderLight pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-inkSubtle">
                    ⚡ Quick / Short Version (for 1-click replies)
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(result.shortAnswer, 'short')}
                    className="px-2.5 py-1 bg-cardMuted hover:bg-borderLight border border-borderLight rounded-lg text-xs font-bold text-inkPrimary transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedShort ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedShort ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-inkMuted leading-relaxed font-sans bg-canvas p-3 rounded-xl border border-borderLight/60">
                  {result.shortAnswer}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] bg-card/60 border-2 border-dashed border-borderLight rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-3 text-inkMuted">
              <div className="w-14 h-14 rounded-2xl bg-forestLight/60 text-forestPrimary flex items-center justify-center">
                <Link2 className="w-7 h-7" />
              </div>
              <h4 className="font-serif font-bold text-base text-inkPrimary">
                No Answer Generated Yet
              </h4>
              <p className="text-xs max-w-sm">
                Paste a Reddit, Quora, or Shelter question on the left and click <strong>Generate</strong> to auto-match the right Eternal Paws asset and get an optimized reply.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
