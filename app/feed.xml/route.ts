import { NextResponse } from 'next/server';
import { StoryService } from '@/lib/services/story-service';
import { DEFAULT_BASE_URL } from '@/lib/seo';

export const revalidate = 60;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_BASE_URL;
  const stories = await StoryService.getAllStoriesAsync();
  const publishedStories = stories.filter((s) => s.status === 'published').slice(0, 50);

  const rssItems = publishedStories
    .map((story) => {
      const storyUrl = `${baseUrl}/stories/${story.slug}`;
      const pubDate = new Date(story.publishedAt || Date.now()).toUTCString();
      const heroUrl = story.heroImage?.url || '';

      return `
    <item>
      <title><![CDATA[${story.title}]]></title>
      <link>${storyUrl}</link>
      <guid isPermaLink="true">${storyUrl}</guid>
      <description><![CDATA[${story.excerpt || story.subtitle || ''}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${story.category || 'rescues'}]]></category>
      <author><![CDATA[pack@eternal-paws.com (Eternal Paws Editorial Team)]]></author>
      ${heroUrl ? `<enclosure url="${heroUrl}" type="image/jpeg" length="0" />` : ''}
    </item>`;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Eternal Paws — Verified True Dog Stories</title>
    <link>${baseUrl}</link>
    <description>Rigorously verified, uplifting true stories of heroic dogs, joyful reunions, loyalty, and rescue miracles.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
