'use client';

/**
 * Eternal Paws Platform - Real-Time Reader Analytics & Traffic Dashboard
 * Path: components/admin/AnalyticsDashboard.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  Headphones,
  Share2,
  BookOpen,
  ArrowUpRight,
  Globe,
} from 'lucide-react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';

export const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics');
        const data = await res.json();
        if (data.success && data.metrics) {
          setMetrics(data.metrics);
        }
      } catch {
        console.warn('Error fetching analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading || !metrics) {
    return <div className="p-8 text-center text-xs text-inkMuted">Loading real-time analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-card border-borderLight shadow-soft">
          <div className="flex items-center justify-between text-inkSubtle mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pageviews</span>
            <Eye className="w-4 h-4 text-forestPrimary" />
          </div>
          <p className="font-serif text-3xl font-bold text-inkPrimary">
            {metrics.totalPageviews.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +18.4% this month
          </span>
        </Card>

        <Card className="p-5 bg-card border-borderLight shadow-soft">
          <div className="flex items-center justify-between text-inkSubtle mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Read Completion Rate</span>
            <BookOpen className="w-4 h-4 text-forestPrimary" />
          </div>
          <p className="font-serif text-3xl font-bold text-inkPrimary">
            {metrics.avgReadCompletionRate}%
          </p>
          <span className="text-[11px] text-inkMuted mt-1 block">Readers finishing full narrative</span>
        </Card>

        <Card className="p-5 bg-card border-borderLight shadow-soft">
          <div className="flex items-center justify-between text-inkSubtle mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Audio Narration Plays</span>
            <Headphones className="w-4 h-4 text-forestPrimary" />
          </div>
          <p className="font-serif text-3xl font-bold text-inkPrimary">
            {metrics.audioNarrationPlays.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> High engagement voice vibe
          </span>
        </Card>

        <Card className="p-5 bg-card border-borderLight shadow-soft">
          <div className="flex items-center justify-between text-inkSubtle mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Social Shares</span>
            <Share2 className="w-4 h-4 text-forestPrimary" />
          </div>
          <p className="font-serif text-3xl font-bold text-inkPrimary">
            {metrics.socialSharesCount.toLocaleString()}
          </p>
          <span className="text-[11px] text-inkMuted mt-1 block">Facebook, X & WhatsApp</span>
        </Card>
      </div>

      {/* Traffic Sources & Top Stories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Performing Stories */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="font-serif text-lg font-bold text-inkPrimary">
            Top Performing Emotional Stories
          </h3>

          <Card className="bg-card border-borderLight rounded-2xl overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cardMuted/80 border-b border-borderLight text-inkSubtle uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Story Headline</th>
                    <th className="p-4 text-right">Views</th>
                    <th className="p-4 text-right">Audio Plays</th>
                    <th className="p-4 text-right">Shares</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight/60">
                  {metrics.topStories.map((story: any, idx: number) => (
                    <tr key={idx} className="hover:bg-canvas/60 transition-colors">
                      <td className="p-4 font-bold text-inkPrimary font-serif">
                        <a href={`/stories/${story.slug}`} target="_blank" rel="noreferrer" className="hover:text-forestPrimary">
                          {story.title}
                        </a>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-inkPrimary">
                        {story.views.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-mono text-inkMuted">
                        {story.audioPlays.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-mono text-emerald-700 font-bold">
                        {story.shares.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Traffic Channels Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-serif text-lg font-bold text-inkPrimary">
            Traffic Acquisition Channels
          </h3>

          <Card className="p-5 bg-card border-borderLight rounded-2xl shadow-soft space-y-4">
            {metrics.trafficSources.map((ch: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-inkPrimary">
                  <span>{ch.source}</span>
                  <span className="font-mono text-forestPrimary">{ch.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-canvas border border-borderLight rounded-full overflow-hidden">
                  <div
                    className="h-full bg-forestPrimary rounded-full transition-all"
                    style={{ width: `${ch.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
