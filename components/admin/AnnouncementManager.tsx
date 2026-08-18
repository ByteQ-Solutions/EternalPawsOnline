'use client';

/**
 * Eternal Paws Platform - Site Announcement Banner Controller
 * Path: components/admin/AnnouncementManager.tsx
 */

import React, { useState, useEffect } from 'react';
import { Megaphone, Save, CheckCircle2, Eye } from 'lucide-react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { SiteAnnouncement } from '@/app/api/admin/announcements/route';

export const AnnouncementManager: React.FC = () => {
  const [announcement, setAnnouncement] = useState<SiteAnnouncement>({
    isActive: true,
    badgeText: '🐾 Sunday Edition',
    message: 'New verified survival story: Radar the Island Collie is now live!',
    actionUrl: '/stories/bella-blind-beagle-sanctuary-journey',
    actionLabel: 'Read Story',
    updatedAt: new Date().toISOString(),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.announcement) {
          setAnnouncement(data.announcement);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert('Failed to save announcement');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-borderLight rounded-2xl p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-forestPrimary" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary">
              Global Site Announcement Banner
            </h2>
            <Badge variant={announcement.isActive ? 'forest' : 'unverified'} size="sm">
              {announcement.isActive ? 'Live on Site' : 'Disabled'}
            </Badge>
          </div>
          <p className="text-xs text-inkMuted mt-1">
            Display breaking dog reunions, urgent alerts, or Sunday digest highlights at the very top of all public pages.
          </p>
        </div>
      </div>

      {/* Live Preview of Banner */}
      {announcement.isActive && (
        <div className="p-4 bg-forestPrimary text-white rounded-2xl shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="bg-goldAccent text-inkPrimary font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">
              {announcement.badgeText}
            </span>
            <span className="font-medium">{announcement.message}</span>
          </div>
          {announcement.actionUrl && (
            <a
              href={announcement.actionUrl}
              target="_blank"
              rel="noreferrer"
              className="underline font-bold text-goldLight hover:text-white"
            >
              {announcement.actionLabel || 'Learn More'} →
            </a>
          )}
        </div>
      )}

      {/* Banner Configuration Form */}
      <Card className="p-6 bg-card border-borderLight rounded-2xl shadow-soft">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-borderLight">
            <input
              type="checkbox"
              id="banner-active"
              checked={announcement.isActive}
              onChange={(e) => setAnnouncement({ ...announcement, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-forestPrimary focus:ring-forestPrimary"
            />
            <label htmlFor="banner-active" className="text-xs font-bold uppercase tracking-wider text-inkPrimary cursor-pointer">
              Enable Announcement Banner Globally
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="banner-badge" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Badge Pill Text
              </label>
              <input
                id="banner-badge"
                type="text"
                value={announcement.badgeText}
                onChange={(e) => setAnnouncement({ ...announcement, badgeText: e.target.value })}
                placeholder="e.g. 🐾 Sunday Edition"
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="banner-msg" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Announcement Message
              </label>
              <input
                id="banner-msg"
                type="text"
                value={announcement.message}
                onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                placeholder="e.g. New verified dog reunion: Radar is live!"
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="banner-link" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Target URL Link (Optional)
              </label>
              <input
                id="banner-link"
                type="text"
                value={announcement.actionUrl || ''}
                onChange={(e) => setAnnouncement({ ...announcement, actionUrl: e.target.value })}
                placeholder="/stories/bella-blind-beagle-sanctuary-journey"
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-xs font-mono focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>

            <div>
              <label htmlFor="banner-btn-text" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                Button Label
              </label>
              <input
                id="banner-btn-text"
                type="text"
                value={announcement.actionLabel || ''}
                onChange={(e) => setAnnouncement({ ...announcement, actionLabel: e.target.value })}
                placeholder="Read Story"
                className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-borderLight">
            {saved ? (
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Announcement saved & live!
              </span>
            ) : <span />}

            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              className="min-h-[44px] px-6 text-xs font-bold shadow-soft"
            >
              <Save className="w-4 h-4 mr-1.5" /> Save Announcement Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AnnouncementManager;
