/**
 * Eternal Paws Platform - Shared Submissions Ingestion & Moderation Service
 * Path: src/lib/services/submission-service.ts
 * 
 * Provides unified storage for community story submissions across Supabase and in-memory fallback.
 */

import { getSupabase } from '@/lib/db/supabase';

export interface CommunitySubmission {
  id: string;
  ticketCode: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone?: string;
  relationship: string;
  dogName: string;
  dogBreed: string;
  city: string;
  state: string;
  eventYear?: string;
  category: string;
  emotionalThemes?: string[];
  storyTitle: string;
  storyText: string;
  photoName?: string;
  photoUrl?: string;
  photoCredit?: string;
  licenseType?: string;
  sourceName?: string;
  sourceUrl?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewNotes?: string;
}

// In-Memory live submission repository
const liveSubmissions: CommunitySubmission[] = [];

export const SubmissionService = {
  /**
   * Records a new user story submission into memory and Supabase.
   */
  async recordSubmission(payload: {
    submitterName: string;
    submitterEmail: string;
    submitterPhone?: string;
    dogName: string;
    dogBreed?: string;
    locationCity: string;
    locationState?: string;
    eventYear?: string;
    category?: string;
    emotionalThemes?: string[];
    storyTitle: string;
    storyNarrative: string;
    photoName?: string;
    photoUrl?: string;
    photoCredit?: string;
    licenseType?: string;
    sourceName?: string;
    sourceUrl?: string;
  }): Promise<CommunitySubmission> {
    const now = new Date();
    const year = now.getFullYear();
    const monthDay = String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketCode = `SUB-${year}-${monthDay}-${randomHex}`;
    const id = `sub-${Date.now()}-${randomHex.toLowerCase()}`;

    const submission: CommunitySubmission = {
      id,
      ticketCode,
      submitterName: payload.submitterName,
      submitterEmail: payload.submitterEmail,
      submitterPhone: payload.submitterPhone,
      relationship: 'Story Submitter & Pet Parent',
      dogName: payload.dogName,
      dogBreed: payload.dogBreed || 'Rescue Mix',
      city: payload.locationCity,
      state: payload.locationState || '',
      eventYear: payload.eventYear || year.toString(),
      category: payload.category || 'rescues',
      emotionalThemes: payload.emotionalThemes || ['heartwarming'],
      storyTitle: payload.storyTitle,
      storyText: payload.storyNarrative,
      photoName: payload.photoName,
      photoUrl: payload.photoUrl,
      photoCredit: payload.photoCredit || `Photo by ${payload.submitterName}`,
      licenseType: payload.licenseType || 'user_submitted_verified',
      sourceName: payload.sourceName,
      sourceUrl: payload.sourceUrl,
      status: 'pending',
      submittedAt: now.toISOString(),
    };

    // Prepend to memory store so it appears at top of Admin Inbox
    liveSubmissions.unshift(submission);

    // Save to Supabase if connected
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('story_submissions').insert({
          id,
          ticket_code: ticketCode,
          submitter_name: payload.submitterName,
          submitter_email: payload.submitterEmail,
          submitter_phone: payload.submitterPhone || null,
          dog_name: payload.dogName,
          dog_breed: payload.dogBreed || null,
          location_city: payload.locationCity,
          location_state: payload.locationState || null,
          event_year: payload.eventYear || null,
          category: payload.category || 'rescues',
          emotional_themes: payload.emotionalThemes || [],
          story_title: payload.storyTitle,
          story_narrative: payload.storyNarrative,
          photo_name: payload.photoName || null,
          photo_credit: payload.photoCredit || `Photo by ${payload.submitterName}`,
          license_type: payload.licenseType || 'user_submitted_verified',
          source_name: payload.sourceName || null,
          source_url: payload.sourceUrl || null,
          rights_confirmed: true,
          status: 'pending_review',
          created_at: now.toISOString(),
        });
      } catch (dbErr) {
        console.warn('Supabase submission insert skipped:', dbErr);
      }
    }

    return submission;
  },

  /**
   * Fetches all submissions from Supabase and active memory.
   */
  async getAllSubmissions(): Promise<CommunitySubmission[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('story_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          const mapped: CommunitySubmission[] = data.map((d) => ({
            id: d.id || d.ticket_code,
            ticketCode: d.ticket_code,
            submitterName: d.submitter_name,
            submitterEmail: d.submitter_email,
            submitterPhone: d.submitter_phone || undefined,
            relationship: 'Story Submitter & Pet Parent',
            dogName: d.dog_name,
            dogBreed: d.dog_breed || 'Rescue Mix',
            city: d.location_city,
            state: d.location_state || '',
            eventYear: d.event_year || '',
            category: d.category || 'rescues',
            emotionalThemes: d.emotional_themes || [],
            storyTitle: d.story_title,
            storyText: d.story_narrative,
            photoName: d.photo_name || undefined,
            photoUrl: d.photo_url || undefined,
            photoCredit: d.photo_credit || `Photo by ${d.submitter_name}`,
            licenseType: d.license_type || 'user_submitted_verified',
            sourceName: d.source_name || undefined,
            sourceUrl: d.source_url || undefined,
            status: (d.status === 'pending_review' ? 'pending' : d.status) as CommunitySubmission['status'],
            submittedAt: d.created_at,
            reviewNotes: d.review_notes || undefined,
          }));

          // Merge with memory submissions
          const map = new Map<string, CommunitySubmission>();
          for (const item of liveSubmissions) map.set(item.ticketCode, item);
          for (const item of mapped) map.set(item.ticketCode, item);
          return Array.from(map.values());
        }
      } catch (err) {
        console.warn('Supabase submissions fetch fallback:', err);
      }
    }

    return [...liveSubmissions];
  },

  /**
   * Updates submission moderation status.
   */
  async updateStatus(id: string, status: CommunitySubmission['status'], notes?: string): Promise<boolean> {
    const item = liveSubmissions.find((s) => s.id === id || s.ticketCode === id);
    if (item) {
      item.status = status;
      if (notes) item.reviewNotes = notes;
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('story_submissions')
          .update({
            status: status === 'pending' ? 'pending_review' : status,
            review_notes: notes,
          })
          .or(`id.eq.${id},ticket_code.eq.${id}`);
      } catch (err) {
        console.warn('Supabase submission status update note:', err);
      }
    }

    return true;
  },
};
