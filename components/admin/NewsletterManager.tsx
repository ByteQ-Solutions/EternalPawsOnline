'use client';

/**
 * Eternal Paws Platform - Newsletter Subscribers Hub & Sunday Broadcast Campaign Dispatcher
 * Path: components/admin/NewsletterManager.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Download,
  CheckCircle2,
  Users,
  Sparkles,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { SubscriberItem } from '@/app/api/admin/newsletter/broadcast/route';

export const NewsletterManager: React.FC = () => {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<{ message: string; count: number } | null>(null);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/newsletter/broadcast');
      const data = await res.json();
      if (data.success && data.subscribers) {
        setSubscribers(data.subscribers);
      }
    } catch {
      console.warn('Error fetching subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleExportCSV = () => {
    const csvRows = [
      ['Email', 'Subscribed Date', 'Status', 'Double Opt-In'],
      ...subscribers.map((s) => [s.email, s.subscribedAt, s.status, s.confirmedDoubleOptIn ? 'Yes' : 'No']),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eternal_paws_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBroadcastSunday = async () => {
    setIsBroadcasting(true);
    setBroadcastResult(null);

    try {
      const res = await fetch('/api/admin/newsletter/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setBroadcastResult({ message: data.message, count: data.dispatchedCount });
      }
    } catch {
      alert('Broadcast dispatch failed.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Broadcast Banner Card */}
      <div className="bg-forestLight/40 border border-forestPrimary/20 rounded-2xl p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-forestPrimary" />
            <h2 className="font-serif text-xl font-bold text-inkPrimary">
              Sunday Newsletter Broadcast Center
            </h2>
            <Badge variant="forest" size="sm">
              {subscribers.length} Active Subscribers
            </Badge>
          </div>
          <p className="text-xs text-inkMuted mt-1">
            Dispatch the automated &ldquo;One True Dog Story Every Sunday&rdquo; digest email directly to your reader list.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="min-h-[44px] px-4 rounded-xl border border-borderLight bg-card text-xs font-bold text-inkPrimary hover:bg-cardMuted flex items-center gap-1.5 transition-colors shadow-soft"
          >
            <Download className="w-4 h-4 text-forestPrimary" /> Export CSV
          </button>

          <Button
            type="button"
            variant="primary"
            onClick={handleBroadcastSunday}
            isLoading={isBroadcasting}
            className="min-h-[44px] text-xs font-bold shadow-soft"
          >
            <Send className="w-4 h-4 mr-1.5" /> Send Sunday Digest
          </Button>
        </div>
      </div>

      {broadcastResult && (
        <div role="alert" className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{broadcastResult.message}</span>
        </div>
      )}

      {/* Subscribers Table */}
      <Card className="bg-card border-borderLight rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cardMuted/80 border-b border-borderLight text-inkSubtle uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Email Subscriber</th>
                <th className="p-4">Subscribed Date</th>
                <th className="p-4">Delivery Status</th>
                <th className="p-4">Double Opt-In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-canvas/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-inkPrimary">{sub.email}</td>
                  <td className="p-4 text-inkMuted">
                    {new Date(sub.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
                    </span>
                  </td>
                  <td className="p-4 text-inkSubtle">
                    <span className="text-forestPrimary font-bold">✓ Confirmed</span>
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

export default NewsletterManager;
