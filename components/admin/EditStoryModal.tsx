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
  const [isSaving, setIsSaving] = useState(false);
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

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setHeroImageUrl(dataUrl);
      if (!heroImageCredit) setHeroImageCredit(`Photo archive / ${file.name}`);
      setErrorMsg(null);
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
          hero_image_url: heroImageUrl || story.heroImage?.url,
          hero_image_credit: heroImageCredit || story.heroImage?.credit,
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
              <label htmlFor="edit-title" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Headline Title (10-120 chars)
              </label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm font-serif font-bold text-inkPrimary focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
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
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {heroImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={heroImageUrl}
                  alt={title || 'Story photo'}
                  className="w-28 h-20 object-cover rounded-lg border border-borderLight shadow-sm flex-shrink-0"
                />
              ) : (
                <div className="w-28 h-20 bg-canvas rounded-lg border border-dashed border-borderLight flex items-center justify-center text-inkSubtle text-xs">
                  No Image
                </div>
              )}

              <div className="flex-1 w-full space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="edit-modal-photo-upload"
                    className="min-h-[36px] px-3.5 py-1.5 bg-forestPrimary text-white text-xs font-bold rounded-lg shadow-soft inline-flex items-center gap-1.5 cursor-pointer hover:bg-forestDark transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" /> Upload New Photo
                    <input
                      id="edit-modal-photo-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="Or paste image URL (https://...)"
                    value={heroImageUrl}
                    onChange={(e) => setHeroImageUrl(e.target.value)}
                    className="flex-1 min-w-[200px] min-h-[36px] px-3 py-1 bg-canvas border border-borderLight rounded-lg text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Photo Credit / Photographer Attribution"
                  value={heroImageCredit}
                  onChange={(e) => setHeroImageCredit(e.target.value)}
                  className="w-full min-h-[36px] px-3 py-1 bg-canvas border border-borderLight rounded-lg text-xs"
                />
              </div>
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
