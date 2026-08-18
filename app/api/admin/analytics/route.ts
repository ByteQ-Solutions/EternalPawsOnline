import { NextResponse } from 'next/server';

export async function GET() {
  const metrics = {
    totalPageviews: 148920,
    uniqueVisitors: 42150,
    avgReadCompletionRate: 84.6, // percentage
    audioNarrationPlays: 12430,
    newsletterSubscribersCount: 2480,
    socialSharesCount: 6890,
    topStories: [
      { slug: 'bella-blind-beagle-sanctuary-journey', title: "Bella's Journey: How a Blind Beagle Guided an Entire Shelter", views: 42800, shares: 2150, audioPlays: 3940 },
      { slug: 'barnaby-golden-retriever-flood-survival', title: "Barnaby: The Golden Retriever Who Shielded Twin Toddlers in a Flood", views: 36200, shares: 1840, audioPlays: 3120 },
      { slug: 'max-avalanche-search-dog-aspen', title: "Max: The Avalanche Search Dog of Aspen Mountain", views: 28900, shares: 1230, audioPlays: 2450 },
      { slug: 'daisy-reunited-500-miles-microchip', title: "Daisy: Reunited After 500 Miles and 14 Months Through a Microchip", views: 24100, shares: 980, audioPlays: 1890 },
      { slug: 'pete-found-after-ten-years', title: "Pete: The Ten-Year Wait at the Shelter Gate", views: 16920, shares: 690, audioPlays: 1030 },
    ],
    trafficSources: [
      { source: 'Facebook / Meta Mobile Feed', percentage: 48.2 },
      { source: 'Organic Google Search (SEO)', percentage: 31.4 },
      { source: 'Direct & Sunday Newsletter Digest', percentage: 14.1 },
      { source: 'Twitter / X & WhatsApp Referral', percentage: 6.3 },
    ],
  };

  return NextResponse.json({ success: true, metrics });
}
