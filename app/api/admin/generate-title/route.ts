import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { rawTitle, dogName, dogBreed, location, category, summary } = await req.json();

    const name = dogName?.trim() || 'Loyal Dog';
    const breed = dogBreed?.trim() || 'Rescue Dog';
    const loc = location?.trim() || 'Forest Trail';
    const cat = category || 'rescues';

    const suggestions: { title: string; style: string; explanation: string }[] = [];

    // If user provided a raw draft title, create refined viral hooks
    if (rawTitle && rawTitle.length > 5) {
      const cleanRaw = rawTitle.replace(/[.\-_]+$/, '').trim();

      suggestions.push({
        title: `${cleanRaw} — Full Rescue & Reunion Timeline`,
        style: 'SEO Search & Discover Master',
        explanation: 'Optimized for Google Discover clicks and search featured snippets with timeline intent.',
      });

      suggestions.push({
        title: `${breed} ${name} Refused To Give Up In ${loc} Until Rescuers Heard This Faint Sound`,
        style: 'The Dodo Viral Curiosity Hook',
        explanation: 'Extreme emotional tension and curiosity trigger with high social media CTR.',
      });

      suggestions.push({
        title: `After Vanishing in ${loc}, ${name} the ${breed} Leads Search Crew To An Incredible Miracle`,
        style: 'Emotional Heartwarming Arc',
        explanation: 'Pure uplifting emotional resolution that drives maximum Facebook & Pinterest shares.',
      });
    } else {
      // Category-based high-CTR templates
      if (cat === 'hero-dogs') {
        suggestions.push({
          title: `When Danger Struck in ${loc}, Brave ${breed} ${name} Refused To Leave Until Everyone Was Safe`,
          style: 'The Dodo Heroic Hook',
          explanation: 'Focuses on unconditional canine loyalty and protective instinct.',
        });
        suggestions.push({
          title: `Hero ${breed} Alerts First Responders in ${loc} Just Minutes Before Disaster Struck`,
          style: 'Urgent Breaking News Arc',
          explanation: 'Fast-paced timeline hook with strong Google News & Discover appeal.',
        });
        suggestions.push({
          title: `${name} the ${breed} Won't Stop Barking Until Officers Followed Him Into The Woods`,
          style: 'Viral Curiosity Mystery',
          explanation: 'Classic high-converting animal journalism storytelling format.',
        });
      } else if (cat === 'reunions') {
        suggestions.push({
          title: `Years After Disappearing in ${loc}, ${name} the ${breed} Recognizes Owner’s Voice 800 Miles Away`,
          style: 'Tearjerker Joyful Reunion',
          explanation: 'Emotional distance and time contrast creates intense empathy.',
        });
        suggestions.push({
          title: `Family Had Lost All Hope — Until A Microchip Scanner In ${loc} Beeped For ${name}`,
          style: 'The Dodo Microchip Wonder',
          explanation: 'Relatable pet-parent emotion with sudden positive twist.',
        });
        suggestions.push({
          title: `Missing ${breed} ${name} Walks Up To Stranger in ${loc} Wearing The Same Faded Collar`,
          style: 'Unbelievable True Reunion',
          explanation: 'High emotional resonance and visual storytelling.',
        });
      } else if (cat === 'survival') {
        suggestions.push({
          title: `Alone in The ${loc} Wilderness for Weeks: How ${name} the ${breed} Defied All Odds To Survive`,
          style: 'Miraculous Survival Epic',
          explanation: 'Showcases resilience and determination in harsh conditions.',
        });
        suggestions.push({
          title: `Rescue Team Spots Missing ${breed} Trapped On Steep Ledge in ${loc} Just In Time`,
          style: 'High-Stakes Dramatic Rescue',
          explanation: 'Creates edge-of-seat suspense and massive social engagement.',
        });
        suggestions.push({
          title: `Freezing Cold and Injured, ${name} The Brave ${breed} Kept Fighting Until Help Arrived`,
          style: 'Inspirational Hero Dog',
          explanation: 'Heartwarming courage that compels readers to share.',
        });
      } else {
        suggestions.push({
          title: `Scared ${breed} Found Trembling in ${loc} Wouldn’t Let Anyone Close — Until One Officer Sat Down`,
          style: 'The Dodo Patient Rescuer Hook',
          explanation: 'Top-performing animal rescue story angle worldwide.',
        });
        suggestions.push({
          title: `Firefighters in ${loc} Refused To Leave Until Trapped ${breed} ${name} Was Brought To Safety`,
          style: 'Dedicated Community Heroes',
          explanation: 'Celebrates both canine spirit and frontline animal rescuers.',
        });
        suggestions.push({
          title: `From Neglected Stray in ${loc} To Cherished Companion: ${name}'s Incredible Second Chance`,
          style: 'Transformational 3-Act Arc',
          explanation: 'Before-and-after emotional transformation that drives viral loyalty.',
        });
      }
    }

    return NextResponse.json({ success: true, suggestions });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
