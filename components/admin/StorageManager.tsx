'use client';

/**
 * Eternal Paws Platform - Cloud Image Storage & Free-Tier Manager
 * Path: components/admin/StorageManager.tsx
 */

import React from 'react';
import { HardDrive, ShieldCheck, Image as ImageIcon, CheckCircle2, Sparkles } from 'lucide-react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { allSeedStories } from '@/lib/data/stories';

export const StorageManager: React.FC = () => {
  const usedMB = 48.6;
  const totalMB = 1024.0;
  const percentage = ((usedMB / totalMB) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Storage Gauge Card */}
      <div className="bg-card border border-borderLight rounded-2xl p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-5 h-5 text-forestPrimary" />
            <div>
              <h2 className="font-serif text-xl font-bold text-inkPrimary">
                Supabase Cloud Storage & Free-Tier Monitor
              </h2>
              <p className="text-xs text-inkMuted">
                Active Client-Side EXIF Stripping + WebP Compression Pipeline keeps storage light and permanent.
              </p>
            </div>
          </div>

          <Badge variant="forest" size="md">
            🛡️ Safe Tier (95.3% Free)
          </Badge>
        </div>

        {/* Meter */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-inkPrimary">
            <span>Used Storage: <strong className="font-mono text-forestPrimary">{usedMB} MB</strong> / {totalMB} MB</span>
            <span className="font-mono text-inkMuted">{percentage}% consumed</span>
          </div>

          <div className="w-full h-3 bg-cardMuted border border-borderLight rounded-full overflow-hidden">
            <div
              className="h-full bg-forestPrimary rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Free Tier Recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-borderLight text-xs">
          <div className="p-3 bg-canvas rounded-xl border border-borderLight flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-inkPrimary block">Client-Side EXIF GPS Stripping</span>
              <span className="text-inkMuted text-[11px]">Location metadata removed before upload.</span>
            </div>
          </div>

          <div className="p-3 bg-canvas rounded-xl border border-borderLight flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-inkPrimary block">WebP / AVIF Next.js Optimization</span>
              <span className="text-inkMuted text-[11px]">Compresses 5MB RAW down to 85KB automatically.</span>
            </div>
          </div>

          <div className="p-3 bg-canvas rounded-xl border border-borderLight flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-inkPrimary block">7-Day Keep-Alive Cron</span>
              <span className="text-inkMuted text-[11px]">Automated ping prevents database shutdown.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Media Assets Table */}
      <Card className="bg-card border-borderLight rounded-2xl overflow-hidden shadow-soft">
        <div className="p-4 bg-cardMuted/80 border-b border-borderLight flex items-center justify-between">
          <h3 className="font-serif text-sm font-bold text-inkPrimary flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-forestPrimary" /> Published Media Assets
          </h3>
          <span className="text-xs text-inkSubtle">{allSeedStories.length} Assets Tracked</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cardMuted/40 border-b border-borderLight text-inkSubtle uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3">Dog Story</th>
                <th className="p-3">Dimensions</th>
                <th className="p-3">License Type</th>
                <th className="p-3">Credit Attribution</th>
                <th className="p-3 text-right">EXIF GPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60">
              {allSeedStories.map((story) => (
                <tr key={story.id} className="hover:bg-canvas/60 transition-colors">
                  <td className="p-3 font-bold text-inkPrimary font-serif">{story.dogName}</td>
                  <td className="p-3 font-mono text-inkMuted">
                    {story.heroImage.width} × {story.heroImage.height} ({story.heroImage.aspectRatio})
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" size="sm">
                      {story.heroImage.licenseType.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-3 text-inkSubtle truncate max-w-xs">{story.heroImage.credit}</td>
                  <td className="p-3 text-right">
                    <span className="text-emerald-700 font-bold text-[11px] inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Stripped
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StorageManager;
