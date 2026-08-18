/**
 * Eternal Paws Platform - Privacy-First First-Party Event Analytics
 * Path: src/lib/analytics/tracker.ts
 */

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, string | number | boolean>;
}

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

export class AnalyticsTracker {
  private static gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  /**
   * Track custom platform event
   */
  static track(eventName: string, properties?: Record<string, string | number | boolean>): void {
    if (typeof window === 'undefined') return;

    // 1. Google Analytics 4 dispatch if configured
    if (window.gtag && this.gaId) {
      window.gtag('event', eventName, properties);
    }

    // 2. First-party non-invasive telemetry event
    const eventPayload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
      ...properties,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 [Analytics Event]: ${eventName}`, eventPayload);
    }
  }

  static trackStoryView(slug: string, dogName: string, category: string): void {
    this.track('story_view', { story_slug: slug, dog_name: dogName, category });
  }

  static trackScrollDepth(slug: string, depthPercent: number): void {
    this.track('scroll_depth', { story_slug: slug, depth: depthPercent });
  }

  static trackShare(slug: string, platform: string): void {
    this.track('share_click', { story_slug: slug, platform });
  }

  static trackAudioListen(slug: string, dogName: string): void {
    this.track('listen_narration', { story_slug: slug, dog_name: dogName });
  }
}
