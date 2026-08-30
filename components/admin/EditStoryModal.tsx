'use client';

/**
 * Eternal Paws Platform - Editorial Story Editor Modal
 * Path: components/admin/EditStoryModal.tsx
 */

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckCircle2, ShieldCheck, PenTool, Camera, Image as ImageIcon, RefreshCw, Upload } from 'lucide-react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Story } from '@/domain/types';

export interface EditStoryModalProps {
  isOpen: boolean;
  story: Story | null;
  onClose: () => void;
  onStoryUpdated: (updatedStory: Story) => void;
}

export const EditStoryModal: React.FC<EditStoryModalProps> = ({
  isOpen,
  story,
  onClose,
  onStoryUpdated,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState<string>('rescues');
  const [verificationStatus, setVerificationStatus] = useState<string>('Verified');
  const [factChecker, setFactChecker] = useState('Elena Rostova, Fact Checker');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroImageCredit, setHeroImageCredit] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState<{ title: string; style: string; explanation: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (story) {
      setTitle(story.title || '');
      setSubtitle(story.subtitle || '');
      setSlug(story.slug || '');
      setExcerpt(story.excerpt || '');
      setContent(story.content || '');
      setDogName(story.dogName || '');
      setDogBreed(story.dogBreed || '');
      setCity(story.location?.city || '');
      setState(story.location?.stateOrProvince || '');
      setCategory(story.category || 'rescues');
      setVerificationStatus(story.verification?.status || 'Verified');
      setFactChecker(story.verification?.verifiedBy || 'Elena Rostova, Fact Checker');
      setHeroImageUrl(story.heroImage?.url || '');
      setHeroImageCredit(story.heroImage?.credit || '');
      setIsFeatured(story.featured ?? true);
      setErrorMsg(null);
    }
  }, [story]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      // Resize & compress image on client-side canvas to max 1200px and 0.8 quality (~40KB)
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 675;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setHeroImageUrl(compressedDataUrl);
          if (!heroImageCredit) setHeroImageCredit(`Photo archive / ${file.name}`);
          setErrorMsg(null);
        } else {
          setHeroImageUrl(rawDataUrl);
        }
      };
      img.onerror = () => {
        setHeroImageUrl(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen || !story) return null;

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setErrorMsg('Title, slug, and narrative content cannot be empty.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    const updatedPayload: Story = {
      ...story,
      title,
      subtitle: subtitle || '',
      slug,
      excerpt,
      content,
      dogName,
      dogBreed,
      featured: isFeatured,
      heroImage: {
        ...story.heroImage,
        url: heroImageUrl || story.heroImage?.url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
        credit: heroImageCredit || story.heroImage?.credit || 'Editorial Photograph',
      },
      location: {
        city,
        stateOrProvince: state,
        country: story.location?.country || 'United States',
      },
      category: category as Story['category'],
      verification: {
        ...story.verification,
        status: verificationStatus as Story['verification']['status'],
        verifiedBy: factChecker,
      },
    };

    try {
      const res = await fetch('/api/admin/stories/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: story.id,
          oldSlug: story.slug,
          slug,
          title,
          subtitle,
          excerpt,
          content,
          dogName,
          dogBreed,
          category,
          featured: isFeatured,
          heroImage: {
            url: heroImageUrl || story.heroImage?.url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
            altText: story.heroImage?.altText || `Photo of ${dogName}`,
            credit: heroImageCredit || story.heroImage?.credit || 'Editorial Photograph',
            licenseType: story.heroImage?.licenseType || 'original_photography',
            width: story.heroImage?.width || 1200,
            height: story.heroImage?.height || 675,
            aspectRatio: story.heroImage?.aspectRatio || '16:9',
          },
          location: {
            city,
            stateOrProvince: state,
            country: story.location?.country || 'United States',
          },
          verification: {
            status: verificationStatus,
            factChecker,
            trustScore: story.verification?.confidenceScore || 95,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        onStoryUpdated(updatedPayload);
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to update story.');
      }
    } catch {
      setErrorMsg('Network error while saving story changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-story-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkPrimary/60 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-card border border-borderLight rounded-2xl shadow-elevated overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-borderLight bg-cardMuted/80">
          <div className="flex items-center gap-2.5">
            <PenTool className="w-5 h-5 text-forestPrimary" />
            <div>
              <h2 id="edit-story-title" className="font-serif text-xl font-bold text-inkPrimary">
                Edit Story: {story.dogName}&apos;s Journey
              </h2>
              <span className="text-xs text-inkSubtle font-mono">Slug: /stories/{story.slug}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit story dialog"
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-inkMuted hover:text-inkPrimary hover:bg-card transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-error font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Primary Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="edit-title" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle">
                  Headline Title (10-120 chars) <span className="text-error">*</span>
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setIsGeneratingTitle(true);
                      const res = await fetch('/api/admin/generate-title', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          rawTitle: title,
                          dogName,
                          dogBreed,
                          location: city ? `${city}, ${state}` : 'Wilderness',
                          category,
                        }),
                      });
                      const data = await res.json();
                      if (data.success && data.suggestions) {
                        setTitleSuggestions(data.suggestions);
                      }
                    } catch {
                      // Fallback
                    } finally {
                      setIsGeneratingTitle(false);
                    }
                  }}
                  disabled={isGeneratingTitle}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-forestPrimary bg-forestLight/60 hover:bg-forestLight px-2.5 py-1 rounded-lg border border-forestPrimary/20 transition-all cursor-pointer"
                >
                  {isGeneratingTitle ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <span>✨ AI Hook Refiner (The Dodo & SEO)</span>
                    </>
                  )}
                </button>
              </div>

              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm font-serif font-bold text-inkPrimary focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />

              {/* AI Generated Suggestions Cards */}
              {titleSuggestions.length > 0 && (
                <div className="mt-2.5 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                    <span>💡 Viral Hook Suggestions (Click to apply):</span>
                    <button
                      type="button"
                      onClick={() => setTitleSuggestions([])}
                      className="text-amber-700 hover:text-amber-900 underline text-[10px]"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {titleSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setTitle(item.title);
                          setTitleSuggestions([]);
                        }}
                        className="p-2 bg-card hover:bg-forestLight/40 border border-borderLight hover:border-forestPrimary/40 rounded-lg cursor-pointer transition-all text-left group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-forestPrimary">
                            {item.style}
                          </span>
                          <span className="text-[10px] text-inkSubtle group-hover:text-forestPrimary font-medium">
                            Use this headline →
                          </span>
                        </div>
                        <p className="text-xs font-serif font-bold text-inkPrimary group-hover:text-forestPrimary leading-snug">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-inkMuted mt-0.5">
                          {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="edit-slug" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                URL Slug (Auto 301 redirects if changed)
              </label>
              <input
                id="edit-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-xs font-mono text-inkPrimary focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>

            <div>
              <label htmlFor="edit-category" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Category Hub
              </label>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

          {/* Dog & Location Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="edit-dog-name" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Dog Name
              </label>
              <input
                id="edit-dog-name"
                type="text"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>

            <div>
              <label htmlFor="edit-dog-breed" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Breed
              </label>
              <input
                id="edit-dog-breed"
                type="text"
                value={dogBreed}
                onChange={(e) => setDogBreed(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>

            <div>
              <label htmlFor="edit-city" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                City
              </label>
              <input
                id="edit-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>

            <div>
              <label htmlFor="edit-state" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                State / Province
              </label>
              <input
                id="edit-state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>
          </div>

          {/* Hero Photograph Upload & Preview */}
          <div className="p-4 bg-card rounded-xl border border-borderLight space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-forestPrimary" />
              <span className="text-xs font-bold text-inkPrimary uppercase tracking-wider">
                Hero Photograph & Attribution
              </span>
              {heroImageUrl && (
                <span className="ml-auto text-xs text-forestPrimary font-semibold bg-forestLight px-2 py-0.5 rounded-full">
                  ✓ Photo Ready
                </span>
              )}
            </div>

            {/* Live Thumbnail Preview */}
            {heroImageUrl ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-borderLight bg-cardMuted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImageUrl}
                  alt={title || 'Story photo'}
                  className="w-full h-full object-cover"
                  onError={() => {
                    setHeroImageUrl('');
                    setErrorMsg('Image failed to load — please try another URL or upload a file.');
                  }}
                />
                <button
                  type="button"
                  onClick={() => setHeroImageUrl('')}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white text-xs font-bold flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Remove photo"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-full aspect-video rounded-lg border-2 border-dashed border-borderLight bg-canvas flex flex-col items-center justify-center gap-2 text-inkSubtle">
                <Camera className="w-8 h-8 opacity-30" />
                <span className="text-xs">No photo selected — upload or paste a URL below</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {/* File upload button */}
              <label
                htmlFor="edit-modal-photo-upload"
                className="min-h-[40px] w-full px-3.5 py-2 bg-forestPrimary text-white text-xs font-bold rounded-lg shadow-soft inline-flex items-center justify-center gap-2 cursor-pointer hover:bg-forestDark transition-colors"
              >
                <Camera className="w-4 h-4" />
                {heroImageUrl ? 'Replace Photo (Upload File)' : 'Upload Photo from Device'}
                <input
                  id="edit-modal-photo-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>

              {/* URL paste option */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or paste image URL (https://...)"
                  value={heroImageUrl.startsWith('data:') ? '' : heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  className="flex-1 min-h-[36px] px-3 py-1 bg-canvas border border-borderLight rounded-lg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
                />
              </div>

              {/* Credit */}
              <input
                type="text"
                placeholder="Photo Credit / Photographer Attribution"
                value={heroImageCredit}
                onChange={(e) => setHeroImageCredit(e.target.value)}
                className="w-full min-h-[36px] px-3 py-1 bg-canvas border border-borderLight rounded-lg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="edit-excerpt" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
              Excerpt / SEO Description (20-300 chars)
            </label>
            <textarea
              id="edit-excerpt"
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full p-3 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary resize-y"
            />
          </div>

          {/* Narrative Content Body */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="edit-content" className="text-xs font-bold uppercase tracking-wider text-inkSubtle">
                Full Narrative Story Body
              </label>
              <span className="text-xs text-inkMuted font-mono">
                {wordCount} words (min. 50 words)
              </span>
            </div>
            <textarea
              id="edit-content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-4 bg-canvas border border-borderLight rounded-xl text-sm font-serif leading-relaxed focus-visible:ring-2 focus-visible:ring-forestPrimary resize-y"
            />
          </div>

          {/* Verification Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-borderLight">
            <div>
              <label htmlFor="edit-verif-status" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Verification Tier
              </label>
              <select
                id="edit-verif-status"
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              >
                <option value="Strongly Verified">Strongly Verified</option>
                <option value="Verified">Verified</option>
                <option value="Partially Verified">Partially Verified</option>
                <option value="Unverified">Unverified</option>
              </select>
            </div>

            <div>
              <label htmlFor="edit-factchecker" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Verified Fact Checker
              </label>
              <input
                id="edit-factchecker"
                type="text"
                value={factChecker}
                onChange={(e) => setFactChecker(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>
          </div>

          {/* ⭐ Featured Story / Homepage Hero Spotlight Toggle */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-600 font-bold">⭐</span>
                <span className="text-xs font-bold text-inkPrimary uppercase tracking-wider">Feature as Homepage Hero Spotlight</span>
              </div>
              <p className="text-xs text-inkMuted">
                Pin this story to the top of the homepage hero spotlight banner.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forestPrimary"></div>
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-borderLight">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-borderLight text-inkMuted hover:text-inkPrimary hover:bg-cardMuted text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              className="min-h-[44px] px-6 text-xs font-bold shadow-soft"
            >
              <Save className="w-4 h-4 mr-1.5" /> Save Changes & Update Story
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStoryModal;
