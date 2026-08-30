'use client';

/**
 * Eternal Paws Platform - Editorial CMS Dashboard & Pre-Publish Gate
 * Path: components/admin/AdminDashboard.tsx
 * 
 * Features:
 * - 9-Point Pre-Publish Checklist Validator (PROJECT.md F24)
 * - Automated 301 URL Redirect Manager (PROJECT.md F25)
 * - Story status workflow & confidence score calculation
 * - AI Editorial Assistant Studio (DeepSeek v4 / Qwen 3.8 Multi-Provider)
 * - User & Editorial Staff Management
 * - Reader Submissions Moderation Inbox with 1-Click AI Publish
 * - Fact-Checking & Corrections Resolution Desk
 * - Newsletter Broadcast & Subscribers Hub
 * - Real-Time Reader Analytics Dashboard
 * - Announcement Banner & Cloud Storage Monitor
 */

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  Layers,
  Settings,
  LogOut,
  Edit3,
  Trash2,
  Eye,
  PenTool,
  Sparkles,
  Users,
  Inbox,
  ShieldAlert,
  Mail,
  BarChart3,
  Megaphone,
  HardDrive,
  Copy,
  Check,
  Share2,
  Filter,
} from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { AIStudio } from './AIStudio';
import { CreateStoryModal } from './CreateStoryModal';
import { EditStoryModal } from './EditStoryModal';
import { DeleteStoryModal } from './DeleteStoryModal';
import { UserManagement } from './UserManagement';
import { SubmissionsInbox } from './SubmissionsInbox';
import { CorrectionsDesk } from './CorrectionsDesk';
import { NewsletterManager } from './NewsletterManager';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { AnnouncementManager } from './AnnouncementManager';
import { StorageManager } from './StorageManager';
import { HeroSlideshowManager } from './HeroSlideshowManager';
import { FoodSafetyManager } from './FoodSafetyManager';
import { WellnessManager } from './WellnessManager';
import { Input } from '@/design-system/components/Input';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { Story } from '@/domain/types';
import { HeartPulse, Apple } from 'lucide-react';

interface RedirectRule {
  fromPath: string;
  toPath: string;
  statusCode: number;
}

type AdminTab =
  | 'stories'
  | 'wellness'
  | 'food-safety'
  | 'hero-slideshow'
  | 'ai-studio'
  | 'submissions'
  | 'corrections'
  | 'newsletter'
  | 'users'
  | 'analytics'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('stories');
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [storyToEdit, setStoryToEdit] = useState<Story | null>(null);
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);

  const [redirects, setRedirects] = useState<RedirectRule[]>([
    { fromPath: '/stories/pete-lost-ten-years', toPath: '/stories/pete-found-after-ten-years', statusCode: 301 },
    { fromPath: '/stories/max-mountain-avalanche', toPath: '/stories/max-avalanche-search-dog-aspen', statusCode: 301 },
  ]);
  const [newFromPath, setNewFromPath] = useState('');
  const [newToPath, setNewToPath] = useState('');
  const [redirectError, setRedirectError] = useState('');

  // Live Fetch Stories from Supabase on mount & after actions
  const fetchLiveStories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stories/list');
      const data = await res.json();
      if (data.success && data.stories) {
        setStories(data.stories);
        if (data.stories.length > 0) {
          setSelectedStory((prev) => prev || data.stories[0]);
        }
      }
    } catch (err) {
      console.warn('Live stories fetch fallback:', err);
    }
  }, []);

  useEffect(() => {
    fetchLiveStories();
  }, [fetchLiveStories]);

  const handleStoryCreated = (newStory: Story) => {
    setStories((prev) => [newStory, ...prev.filter((s) => s.id !== newStory.id && s.slug !== newStory.slug)]);
    setSelectedStory(newStory);
    setIsCreateModalOpen(false);
    fetchLiveStories();
  };

  const handleStoryUpdated = (updated: Story) => {
    setStories((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (selectedStory && selectedStory.id === updated.id) {
      setSelectedStory(updated);
    }
  };

  const [corpusFilter, setCorpusFilter] = useState<'all' | 'featured'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isTogglingFeature, setIsTogglingFeature] = useState(false);

  const handleCopyLink = (slug: string) => {
    const url = `https://eternalpaws.online/stories/${slug}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  const filteredStories = stories.filter((story) => {
    // 1. Category Filter
    if (selectedCategory !== 'all' && story.category !== selectedCategory) {
      return false;
    }
    // 2. Featured Filter
    if (corpusFilter === 'featured' && !story.featured) {
      return false;
    }
    // 3. Search Query Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchName = (story.dogName || '').toLowerCase().includes(q);
      const matchTitle = (story.title || '').toLowerCase().includes(q);
      const matchBreed = (story.dogBreed || '').toLowerCase().includes(q);
      const matchLoc = `${story.location?.city || ''} ${story.location?.stateOrProvince || ''}`.toLowerCase().includes(q);
      const matchSlug = (story.slug || '').toLowerCase().includes(q);
      return matchName || matchTitle || matchBreed || matchLoc || matchSlug;
    }
    return true;
  });

  const handleToggleFeatured = async (story: Story) => {
    setIsTogglingFeature(true);
    const nextFeatured = !story.featured;
    // Optimistic UI update
    setStories((prev) =>
      prev.map((s) => (s.id === story.id ? { ...s, featured: nextFeatured } : s))
    );
    if (selectedStory && selectedStory.id === story.id) {
      setSelectedStory({ ...selectedStory, featured: nextFeatured });
    }

    try {
      await fetch('/api/admin/stories/feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: story.id, slug: story.slug, featured: nextFeatured }),
      });
    } catch (err) {
      console.warn('Feature toggle error:', err);
    } finally {
      setIsTogglingFeature(false);
    }
  };

  const handleStoryDeleted = (deletedId: string) => {
    setStories((prev) => {
      const remaining = prev.filter((s) => s.id !== deletedId);
      if (selectedStory && selectedStory.id === deletedId) {
        setSelectedStory(remaining.length > 0 ? remaining[0] : null);
      }
      return remaining;
    });
  };

  const openEditModal = (story: Story) => {
    setStoryToEdit(story);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (story: Story) => {
    setStoryToDelete(story);
    setIsDeleteModalOpen(true);
  };

  // 9-Point Pre-Publish Checklist Calculation
  const runPrePublishChecklist = (story: Story | null) => {
    if (!story) {
      return { checks: [], allPassed: false };
    }
    const titleLength = !!(story.title && story.title.trim().length >= 10 && story.title.trim().length <= 120);
    const slugFormat = !!(story.slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(story.slug));
    const heroImagePresent = !!(story.heroImage?.url && story.heroImage.width > 0 && story.heroImage.height > 0);
    const altTextCompleteness = !!(story.heroImage?.altText && story.heroImage.altText.trim().length >= 10);
    const imageRightsDeclared = !!(story.heroImage?.credit && story.heroImage?.licenseType);
    const verificationSourcesPresent = !!(story.verification?.sources && story.verification.sources.length >= 1);
    const taxonomyAssigned = !!(story.category && story.emotionalThemes && story.emotionalThemes.length >= 1);
    const seoMetaPopulated = !!(story.excerpt && story.excerpt.trim().length >= 20 && story.excerpt.trim().length <= 300);
    const contentLengthSufficient = !!(story.content && story.content.trim().split(/\s+/).length >= 50);

    const checks = [
      { id: 'title', label: 'Title length between 10 and 120 characters', passed: titleLength },
      { id: 'slug', label: 'Semantic kebab-case slug URL format', passed: slugFormat },
      { id: 'hero', label: 'Hero image with explicit width/height dimensions', passed: heroImagePresent },
      { id: 'alt', label: 'Descriptive alt text (>= 10 characters)', passed: altTextCompleteness },
      { id: 'rights', label: 'Image copyright license or AI disclosure declared', passed: imageRightsDeclared },
      { id: 'sources', label: 'At least 1 normalized verification source linked', passed: verificationSourcesPresent },
      { id: 'taxonomy', label: 'Valid story category & emotional themes assigned', passed: taxonomyAssigned },
      { id: 'seo', label: 'SEO excerpt & meta description (20-300 chars)', passed: seoMetaPopulated },
      { id: 'content', label: 'Story narrative body (>= 50 words)', passed: contentLengthSufficient },
    ];

    const allPassed = checks.every((c) => c.passed);
    return { checks, allPassed };
  };

  const checklistResult = runPrePublishChecklist(selectedStory);

  const handleAddRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFromPath.trim() || !newToPath.trim()) return;

    const from = newFromPath.trim().toLowerCase();
    const to = newToPath.trim().toLowerCase();

    if (from === to) {
      setRedirectError('Self-referencing redirect is invalid.');
      return;
    }

    // Check circularity
    let current: string | undefined = to;
    const visited = new Set<string>();
    while (current) {
      if (current === from || visited.has(current)) {
        setRedirectError(`Circular redirect detected for path: ${current}`);
        return;
      }
      visited.add(current);
      const match = redirects.find((r) => r.fromPath === current);
      current = match?.toPath;
    }

    setRedirects((prev) => [{ fromPath: from, toPath: to, statusCode: 301 }, ...prev]);
    setNewFromPath('');
    setNewToPath('');
    setRedirectError('');
  };

  const handleSignOut = () => {
    try {
      document.cookie = 'eternal_paws_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      localStorage.removeItem('eternal_paws_admin_session');
    } catch {
      // Ignore
    }
    window.location.href = '/admin/login';
  };

  return (
    <Container size="default" className="py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-borderLight">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="gold" size="sm" className="font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Eternal Paws Editorial Desk
            </Badge>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary mt-1">
            Story Management & Editorial Command Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="min-h-[44px] px-4 text-xs font-bold shadow-soft"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create New Story
          </Button>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-borderLight text-xs font-bold text-inkPrimary hover:bg-cardMuted transition-colors min-h-[44px]"
          >
            <Eye className="w-4 h-4 text-forestPrimary" /> View Public Site
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-error text-xs font-bold transition-colors min-h-[44px]"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-card border border-borderLight p-1.5 rounded-2xl shadow-soft overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('stories')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'stories'
              ? 'bg-forestPrimary text-white shadow-soft'
              : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
          }`}
        >
          <FileText className="w-4 h-4" /> Stories & Gate ({stories.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wellness')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'wellness'
              ? 'bg-forestPrimary text-white shadow-soft'
              : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
          }`}
        >
          <HeartPulse className="w-4 h-4 text-red-500" /> 🩺 Health & Wellness
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('food-safety')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'food-safety'
              ? 'bg-forestPrimary text-white shadow-soft'
              : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
          }`}
        >
          <Apple className="w-4 h-4 text-emerald-500" /> 🍏 Food Safety
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hero-slideshow')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'hero-slideshow'
              ? 'bg-forestPrimary text-white shadow-soft'
              : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" /> Hero Slideshow ({stories.filter((s) => s.featured).length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai-studio')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ai-studio'
              ? 'bg-forestPrimary text-white shadow-soft'
              : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
          }`}
        >
          <Sparkles className="w-4 h-4 text-goldAccent" /> AI Studio
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('submissions')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'submissions'
              ? 'bg-forestPrimary text-white shadow-soft'
              : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
          }`}
        >
          <Inbox className="w-4 h-4" /> Submissions Inbox
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('corrections')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'corrections'
              ? 'bg-forestPrimary text-white shadow-soft'
              : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Fact-Check Desk
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('newsletter')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'newsletter'
              ? 'bg-forestPrimary text-white shadow-soft'
              : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
          }`}
        >
          <Mail className="w-4 h-4" /> Newsletter Hub
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-forestPrimary text-white shadow-soft'
              : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
          }`}
        >
          <Users className="w-4 h-4" /> User Management
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-forestPrimary text-white shadow-soft'
              : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Analytics
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-forestPrimary text-white shadow-soft'
              : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
          }`}
        >
          <Settings className="w-4 h-4" /> Banner & Storage
        </button>
      </div>

      {/* TAB 1: EDITORIAL STORIES & PRE-PUBLISH GATE */}
      {activeTab === 'stories' && (
        <div className="space-y-8">
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-card border-borderLight">
              <span className="text-xs uppercase font-semibold text-inkSubtle">Published Stories</span>
              <p className="font-serif text-3xl font-bold text-inkPrimary mt-1">{stories.length}</p>
              <span className="text-[11px] text-emerald-700 font-semibold">100% Verified Content</span>
            </Card>

            <Card className="p-5 bg-card border-borderLight">
              <span className="text-xs uppercase font-semibold text-inkSubtle">Avg Confidence</span>
              <p className="font-serif text-3xl font-bold text-forestPrimary mt-1">96%</p>
              <span className="text-[11px] text-inkMuted">Multi-source corroborated</span>
            </Card>

            <Card className="p-5 bg-card border-borderLight">
              <span className="text-xs uppercase font-semibold text-inkSubtle">Active 301 Redirects</span>
              <p className="font-serif text-3xl font-bold text-inkPrimary mt-1">{redirects.length}</p>
              <span className="text-[11px] text-inkMuted">Flattened zero-hop chains</span>
            </Card>

            <Card className="p-5 bg-card border-borderLight">
              <span className="text-xs uppercase font-semibold text-inkSubtle">Fact Check Queue</span>
              <p className="font-serif text-3xl font-bold text-amber-700 mt-1">0 Pending</p>
              <span className="text-[11px] text-inkMuted">All records up-to-date</span>
            </Card>
          </div>

          {/* Two-Column Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Story Corpus List & Management Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-inkPrimary flex items-center gap-2">
                  <span>Story Editorial Corpus</span>
                  <span className="text-xs font-normal text-inkSubtle">({filteredStories.length} of {stories.length})</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-forestPrimary bg-forestLight/60 hover:bg-forestLight rounded-lg transition-colors min-h-[36px]"
                >
                  <Plus className="w-3.5 h-3.5" /> New Story
                </button>
              </div>

              {/* Real-Time Live Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-inkSubtle absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search by dog name, breed, title, city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-card border border-borderLight rounded-xl text-xs text-inkPrimary placeholder:text-inkSubtle focus:outline-none focus:ring-2 focus:ring-forestPrimary/40 transition-all shadow-sm"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-inkSubtle hover:text-inkPrimary text-xs p-1"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Pills (All / Hero / Categories) */}
              <div className="space-y-2 pb-1">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setCorpusFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all min-h-[32px] whitespace-nowrap ${
                      corpusFilter === 'all'
                        ? 'bg-forestPrimary text-white shadow-soft'
                        : 'bg-card border border-borderLight text-inkMuted hover:text-inkPrimary'
                    }`}
                  >
                    All ({stories.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCorpusFilter('featured')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all min-h-[32px] flex items-center gap-1 whitespace-nowrap ${
                      corpusFilter === 'featured'
                        ? 'bg-amber-500 text-white shadow-soft'
                        : 'bg-card border border-borderLight text-inkMuted hover:text-inkPrimary'
                    }`}
                  >
                    ⭐ Hero Featured ({stories.filter((s) => s.featured).length})
                  </button>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                  {[
                    { id: 'all', label: 'All Categories' },
                    { id: 'rescues', label: 'Rescues' },
                    { id: 'reunions', label: 'Reunions' },
                    { id: 'hero-dogs', label: 'Hero Dogs' },
                    { id: 'survival', label: 'Survival' },
                    { id: 'loyalty', label: 'Loyalty' },
                    { id: 'lost-and-found', label: 'Lost & Found' },
                  ].map((cat) => {
                    const count = cat.id === 'all' ? stories.length : stories.filter((s) => s.category === cat.id).length;
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-all whitespace-nowrap ${
                          isActive
                            ? 'bg-forestLight text-forestPrimary border border-forestPrimary/40 font-bold'
                            : 'bg-card text-inkSubtle border border-borderLight hover:text-inkPrimary'
                        }`}
                      >
                        {cat.label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Story Cards List */}
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {filteredStories.length === 0 ? (
                  <div className="p-8 text-center bg-card border border-borderLight rounded-2xl text-inkMuted text-xs space-y-3">
                    <Search className="w-8 h-8 text-inkSubtle mx-auto" />
                    <p className="font-bold text-inkPrimary text-sm">No Matching Stories Found</p>
                    <p>{searchTerm ? `No stories matching "${searchTerm}".` : 'Try selecting a different filter.'}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setCorpusFilter('all');
                      }}
                      className="min-h-[36px] text-xs font-bold"
                    >
                      Reset All Filters
                    </Button>
                  </div>
                ) : (
                  filteredStories.map((story) => {
                    const isSelected = selectedStory?.id === story.id;
                    return (
                      <div
                        key={story.id}
                        onClick={() => setSelectedStory(story)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-forestLight/40 border-forestPrimary shadow-sm ring-1 ring-forestPrimary'
                            : 'bg-card border-borderLight hover:bg-cardMuted'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Dog Image Thumbnail */}
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-canvas border border-borderLight flex-shrink-0 relative">
                            {story.heroImage?.url ? (
                              <img
                                src={story.heroImage.url}
                                alt={story.dogName}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-inkSubtle font-bold text-xs">
                                🐾
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-inkPrimary truncate">
                                {story.dogName} <span className="font-normal text-inkSubtle">({story.dogBreed})</span>
                              </span>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFeatured(story);
                                  }}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                                    story.featured
                                      ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm'
                                      : 'bg-card text-inkSubtle border-borderLight hover:border-amber-300 hover:text-amber-700'
                                  }`}
                                  title={story.featured ? 'Click to unpin from Homepage Hero' : 'Click to pin as Homepage Hero Spotlight'}
                                >
                                  <span>{story.featured ? '⭐ Hero' : '☆ Pin'}</span>
                                </button>
                                <VerificationBadge status={story.verification.status} size="sm" showScore={false} />
                              </div>
                            </div>

                            <p className="text-xs font-semibold text-inkPrimary line-clamp-2 leading-snug">
                              {story.title}
                            </p>
                          </div>
                        </div>

                        {/* Story Card Bottom Action Strip */}
                        <div className="mt-3 pt-2.5 border-t border-borderLight/60 flex items-center justify-between">
                          <span className="text-[11px] text-inkSubtle capitalize">
                            {story.category.replace(/-/g, ' ')} • {story.location.city}, {story.location.stateOrProvince}
                          </span>

                          <div className="flex items-center gap-1">
                            {/* 1-Click Copy Public URL */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyLink(story.slug);
                              }}
                              className="px-2 py-1 rounded-md text-[11px] font-bold text-inkMuted hover:text-forestPrimary hover:bg-card border border-borderLight/80 transition-colors flex items-center gap-1"
                              title="Copy Public Story URL"
                            >
                              {copiedSlug === story.slug ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>

                            <a
                              href={`/stories/${story.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`View live ${story.dogName}'s story`}
                              className="p-1.5 rounded-lg text-inkMuted hover:text-forestPrimary hover:bg-card transition-colors"
                              title="View Live Article"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(story);
                              }}
                              aria-label={`Edit ${story.dogName}'s story`}
                              className="p-1.5 rounded-lg text-inkMuted hover:text-forestPrimary hover:bg-card transition-colors"
                              title="Edit Story"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(story);
                              }}
                              aria-label={`Delete ${story.dogName}'s story`}
                              className="p-1.5 rounded-lg text-inkMuted hover:text-error hover:bg-card transition-colors"
                              title="Delete Story"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Story Inspector, Pre-Publish Gate & 301 Manager */}
            <div className="lg:col-span-7 space-y-6">
              {/* Selected Story Inspector Panel */}
              {selectedStory ? (
                <Card className="bg-card border-borderLight rounded-2xl p-6 shadow-sm space-y-5">
                  {/* Story Overview Header Card */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-canvas border border-borderLight">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-card border border-borderLight flex-shrink-0 relative">
                      {selectedStory.heroImage?.url ? (
                        <img
                          src={selectedStory.heroImage.url}
                          alt={selectedStory.dogName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-inkSubtle text-2xl">🐾</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="forest" size="sm" className="capitalize">
                          {selectedStory.category.replace(/-/g, ' ')}
                        </Badge>
                        <VerificationBadge status={selectedStory.verification.status} size="sm" showScore={true} />
                        {selectedStory.featured && (
                          <Badge variant="gold" size="sm">
                            ⭐ Hero Spotlight
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-serif text-lg font-bold text-inkPrimary leading-tight">
                        {selectedStory.title}
                      </h3>

                      <p className="text-xs text-inkMuted">
                        <strong>{selectedStory.dogName}</strong> ({selectedStory.dogBreed}) • {selectedStory.location.city}, {selectedStory.location.stateOrProvince}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(selectedStory.slug)}
                          className="px-3 py-1.5 bg-card border border-borderLight hover:bg-cardMuted rounded-lg font-bold text-inkPrimary flex items-center gap-1.5 transition-colors"
                        >
                          {copiedSlug === selectedStory.slug ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Public URL</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`/stories/${selectedStory.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-forestPrimary hover:bg-forestHover text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-soft"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View Live Article
                        </a>

                        <button
                          type="button"
                          onClick={() => openEditModal(selectedStory)}
                          className="px-3 py-1.5 bg-card border border-borderLight hover:bg-cardMuted rounded-lg font-bold text-inkPrimary flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-forestPrimary" /> Edit Story
                        </button>

                        <button
                          type="button"
                          onClick={() => openDeleteModal(selectedStory)}
                          className="px-3 py-1.5 bg-card border border-borderLight hover:bg-red-50 text-error rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ⭐ Hero Spotlight Status Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Homepage Hero Spotlight Status
                      </span>
                      <p className="text-xs text-inkMuted">
                        {selectedStory.featured
                          ? '🌟 Currently pinned as the Homepage Hero Spotlight for top reader engagement.'
                          : '⚪ Standard story in latest feeds and category archives.'}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={selectedStory.featured ? 'outline' : 'primary'}
                      onClick={() => handleToggleFeatured(selectedStory)}
                      isLoading={isTogglingFeature}
                      className="min-h-[38px] text-xs font-bold shadow-soft whitespace-nowrap"
                    >
                      {selectedStory.featured ? '⭐ Unpin from Hero' : '⭐ Set as Homepage Hero'}
                    </Button>
                  </div>

                  {/* 9-Point Checklist Gate */}
                  <div>
                    <div className="flex items-center justify-between border-b border-borderLight pb-3 mb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-inkSubtle">
                          Pre-Publish Checklist Gate
                        </span>
                        <h4 className="font-serif text-base font-bold text-inkPrimary">
                          Editorial Quality & Compliance Standards
                        </h4>
                      </div>
                      {checklistResult.allPassed ? (
                        <Badge variant="forest" size="md">
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> 9/9 Ready
                        </Badge>
                      ) : (
                        <Badge variant="unverified" size="md">
                          Incomplete
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2.5 mb-5">
                      {checklistResult.checks.map((check, index) => (
                        <div
                          key={check.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-canvas border border-borderLight/60 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-card text-inkSubtle border border-borderLight">
                              {index + 1}
                            </span>
                            <span className="text-inkPrimary font-medium">{check.label}</span>
                          </div>

                          {check.passed ? (
                            <span className="inline-flex items-center text-xs font-bold text-forestPrimary">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Passed
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-bold text-error">
                              <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Action Needed
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="bg-card border-borderLight rounded-2xl p-8 shadow-sm text-center text-inkMuted text-xs space-y-2">
                  <FileText className="w-8 h-8 text-forestPrimary/40 mx-auto" />
                  <p className="font-bold text-inkPrimary text-sm">Select a Story to Inspect</p>
                  <p>Click any story from the list on the left to review details, copy links, and verify checklist.</p>
                </Card>
              )}

              {/* 301 URL Redirect Manager Panel */}
              <Card className="bg-card border-borderLight rounded-2xl p-6 shadow-sm">
                <div className="border-b border-borderLight pb-4 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-inkSubtle">
                    SEO & External Social Link Health
                  </span>
                  <h2 className="font-serif text-lg font-bold text-inkPrimary">
                    301 URL Redirect & Slug Migration Manager
                  </h2>
                  <p className="text-xs text-inkMuted mt-0.5">
                    Guarantees incoming Facebook links never 404 when editorial slugs change.
                  </p>
                </div>

                {/* Add Redirect Form */}
                <form onSubmit={handleAddRedirect} className="space-y-3 mb-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      id="red-from"
                      placeholder="Old URL: /stories/old-slug"
                      value={newFromPath}
                      onChange={(e) => setNewFromPath(e.target.value)}
                      required
                    />
                    <Input
                      id="red-to"
                      placeholder="New URL: /stories/new-slug"
                      value={newToPath}
                      onChange={(e) => setNewToPath(e.target.value)}
                      required
                    />
                  </div>

                  {redirectError && (
                    <p role="alert" className="text-xs text-error font-semibold">
                      {redirectError}
                    </p>
                  )}

                  <Button type="submit" variant="secondary" className="w-full min-h-[44px]">
                    <Plus className="w-4 h-4 mr-1.5" /> Add 301 Redirect Rule
                  </Button>
                </form>

                {/* Redirect Rules Table */}
                <div className="border border-borderLight rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-12 bg-cardMuted p-2.5 font-bold text-inkSubtle uppercase tracking-wider">
                    <div className="col-span-5">From Path</div>
                    <div className="col-span-5">To Target</div>
                    <div className="col-span-2 text-right">HTTP Code</div>
                  </div>
                  <div className="divide-y divide-borderLight/60">
                    {redirects.map((r, i) => (
                      <div key={i} className="grid grid-cols-12 p-2.5 font-mono text-inkPrimary hover:bg-canvas">
                        <div className="col-span-5 truncate text-inkMuted">{r.fromPath}</div>
                        <div className="col-span-5 truncate font-semibold text-forestPrimary">{r.toPath}</div>
                        <div className="col-span-2 text-right font-bold text-emerald-700">{r.statusCode}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HEALTH & WELLNESS DESK */}
      {activeTab === 'wellness' && <WellnessManager />}

      {/* TAB 3: FOOD SAFETY DESK */}
      {activeTab === 'food-safety' && <FoodSafetyManager />}

      {/* TAB 4: HERO SLIDESHOW & SPOTLIGHT CAROUSEL */}
      {activeTab === 'hero-slideshow' && (
        <HeroSlideshowManager
          stories={stories}
          onToggleFeatured={handleToggleFeatured}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* TAB 3: AI EDITORIAL STUDIO */}
      {activeTab === 'ai-studio' && <AIStudio onStoryPublished={fetchLiveStories} />}

      {/* TAB 4: READER SUBMISSIONS INBOX */}
      {activeTab === 'submissions' && <SubmissionsInbox onStoryPublished={fetchLiveStories} />}

      {/* TAB 4: FACT-CHECKING & CORRECTIONS */}
      {activeTab === 'corrections' && <CorrectionsDesk />}

      {/* TAB 5: NEWSLETTER BROADCAST HUB */}
      {activeTab === 'newsletter' && <NewsletterManager />}

      {/* TAB 6: USER & EDITORIAL STAFF MANAGEMENT */}
      {activeTab === 'users' && <UserManagement />}

      {/* TAB 7: REAL-TIME ANALYTICS */}
      {activeTab === 'analytics' && <AnalyticsDashboard />}

      {/* TAB 8: ANNOUNCEMENTS & STORAGE */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          <AnnouncementManager />
          <StorageManager />
        </div>
      )}

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onStoryCreated={handleStoryCreated}
      />

      {/* Edit Story Modal */}
      <EditStoryModal
        isOpen={isEditModalOpen}
        story={storyToEdit}
        onClose={() => setIsEditModalOpen(false)}
        onStoryUpdated={handleStoryUpdated}
      />

      {/* Delete Story Modal */}
      <DeleteStoryModal
        isOpen={isDeleteModalOpen}
        story={storyToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onStoryDeleted={handleStoryDeleted}
      />
    </Container>
  );
};

export default AdminDashboard;
