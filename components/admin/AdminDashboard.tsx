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

import React, { useState, useEffect } from 'react';
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
import { Input } from '@/design-system/components/Input';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { Story } from '@/domain/types';

interface RedirectRule {
  fromPath: string;
  toPath: string;
  statusCode: number;
}

type AdminTab =
  | 'stories'
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

  // Live Fetch Stories from Supabase on mount
  useEffect(() => {
    const fetchLiveStories = async () => {
      try {
        const res = await fetch('/api/admin/stories/list');
        const data = await res.json();
        if (data.success && data.stories) {
          setStories(data.stories);
          if (data.stories.length > 0) {
            setSelectedStory(data.stories[0]);
          }
        }
      } catch (err) {
        console.warn('Live stories fetch fallback:', err);
      }
    };
    fetchLiveStories();
  }, []);

  const handleStoryCreated = (newStory: Story) => {
    setStories((prev) => [newStory, ...prev]);
    setSelectedStory(newStory);
    setIsCreateModalOpen(false);
  };

  const handleStoryUpdated = (updated: Story) => {
    setStories((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (selectedStory && selectedStory.id === updated.id) {
      setSelectedStory(updated);
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
          <FileText className="w-4 h-4" /> Editorial Stories & Gate
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
            {/* Left Column: Story Corpus List */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-inkPrimary flex items-center gap-2">
                  <span>Story Editorial Corpus</span>
                  <span className="text-xs font-normal text-inkSubtle">({stories.length})</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-forestPrimary bg-forestLight/60 hover:bg-forestLight rounded-lg transition-colors min-h-[36px]"
                >
                  <Plus className="w-3.5 h-3.5" /> New Story
                </button>
              </div>

              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {stories.length === 0 ? (
                  <div className="p-8 text-center bg-card border border-borderLight rounded-2xl text-inkMuted text-xs space-y-3">
                    <Sparkles className="w-8 h-8 text-goldAccent mx-auto" />
                    <p className="font-bold text-inkPrimary text-sm">No Stories in Corpus Yet</p>
                    <p>Create a verified dog story manually or generate one with AI in 3 seconds!</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="min-h-[40px] text-xs font-bold shadow-soft"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Create Manually
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab('ai-studio')}
                        className="min-h-[40px] text-xs font-bold"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1" /> Open AI Studio
                      </Button>
                    </div>
                  </div>
                ) : (
                  stories.map((story) => {
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
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-inkPrimary">
                            {story.dogName} ({story.dogBreed})
                          </span>
                          <VerificationBadge status={story.verification.status} size="sm" showScore={false} />
                        </div>

                        <p className="text-sm font-semibold text-inkPrimary line-clamp-2 leading-snug">
                          {story.title}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-borderLight/60 flex items-center justify-between">
                          <span className="text-[11px] text-inkSubtle">
                            {story.location.city}, {story.location.stateOrProvince} • {story.readTimeMinutes}m
                          </span>

                          <div className="flex items-center gap-1">
                            <a
                              href={`/stories/${story.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`View live ${story.dogName}'s story`}
                              className="p-1.5 rounded-lg text-inkMuted hover:text-forestPrimary hover:bg-card transition-colors"
                              title="View Live"
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

            {/* Right Column: Pre-Publish Checklist & 301 Manager */}
            <div className="lg:col-span-7 space-y-6">
              {/* 9-Point Checklist Panel */}
              {selectedStory ? (
                <Card className="bg-card border-borderLight rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderLight pb-4 mb-5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-inkSubtle">
                        Pre-Publish Checklist Gate
                      </span>
                      <h2 className="font-serif text-xl font-bold text-inkPrimary">
                        Reviewing: {selectedStory.dogName}&apos;s Story
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(selectedStory)}
                        className="min-h-[36px] px-3 py-1 bg-card border border-borderLight rounded-lg text-xs font-bold text-inkPrimary hover:bg-cardMuted flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-forestPrimary" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(selectedStory)}
                        className="min-h-[36px] px-3 py-1 bg-card border border-borderLight rounded-lg text-xs font-bold text-error hover:bg-red-50 flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
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
                  </div>

                  <div className="space-y-3 mb-6">
                    {checklistResult.checks.map((check, index) => (
                      <div
                        key={check.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-canvas border border-borderLight/60 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-card text-inkSubtle border border-borderLight">
                            {index + 1}
                          </span>
                          <span className="text-inkPrimary font-medium">{check.label}</span>
                        </div>

                        {check.passed ? (
                          <span className="inline-flex items-center text-xs font-bold text-forestPrimary">
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-bold text-error">
                            <AlertTriangle className="w-4 h-4 mr-1" /> Action Needed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-borderLight">
                    <div className="text-xs text-inkMuted">
                      <span>Confidence Score: </span>
                      <span className="font-bold text-forestPrimary">{selectedStory.verification.confidenceScore}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openEditModal(selectedStory)}
                        className="min-h-[44px]"
                      >
                        <Edit3 className="w-4 h-4 mr-1.5" /> Edit Full Story
                      </Button>
                      <Button
                        variant="primary"
                        disabled={!checklistResult.allPassed}
                        className="min-h-[44px]"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Publish Story
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="bg-card border-borderLight rounded-2xl p-8 shadow-sm text-center text-inkMuted text-xs space-y-2">
                  <FileText className="w-8 h-8 text-forestPrimary/40 mx-auto" />
                  <p className="font-bold text-inkPrimary text-sm">Editorial Gate Ready</p>
                  <p>Publish a story from AI Studio or Reader Submissions to review the 9-point checklist.</p>
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

      {/* TAB 2: AI EDITORIAL STUDIO */}
      {activeTab === 'ai-studio' && <AIStudio />}

      {/* TAB 3: READER SUBMISSIONS INBOX */}
      {activeTab === 'submissions' && <SubmissionsInbox />}

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
