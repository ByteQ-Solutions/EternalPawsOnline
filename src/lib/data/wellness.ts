/**
 * Eternal Paws Platform - Master Canine Health, Behavior & Wellness Database
 * Path: src/lib/data/wellness.ts
 * 
 * Vet-reviewed medical guidance, emergency first-aid protocols, canine behavioral
 * neuroscience, and Schema.org MedicalWebPage + FAQPage structured data.
 */

export type WellnessCategory = 'first-aid' | 'behavior' | 'nutrition' | 'senior-care' | 'puppy-care';
export type UrgencyLevel = 'emergency' | 'high' | 'moderate' | 'informational';

export interface WellnessSource {
  name: string;
  url?: string;
  organization: string;
}

export interface WellnessFAQ {
  question: string;
  answer: string;
}

export interface WellnessGuide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: WellnessCategory;
  urgency: UrgencyLevel;
  readTimeMinutes: number;
  vetReviewedBy: string;
  vetCredentials: string;
  lastReviewedAt: string;
  keyTakeaways: string[];
  heroImage: {
    url: string;
    altText: string;
    credit: string;
  };
  overview: string;
  symptomsOrSigns?: {
    title: string;
    description: string;
    isSevere?: boolean;
  }[];
  actionProtocol: {
    stepNumber: number;
    title: string;
    instructions: string;
    cautionNote?: string;
  }[];
  whenToCallVet: string[];
  faq: WellnessFAQ[];
  sources: WellnessSource[];
}

export const allWellnessGuides: WellnessGuide[] = [
  // ==================== EMERGENCY FIRST AID ====================
  {
    id: 'guide-chocolate-toxicity',
    slug: 'chocolate-toxicity-dog-emergency-protocol',
    title: 'What to Do If Your Dog Ate Chocolate: Emergency Veterinary Action Protocol',
    subtitle: 'A clinical emergency step-by-step guide on calculating theobromine toxicity and saving your dog.',
    excerpt: 'Chocolate contains theobromine and caffeine, which dogs cannot metabolize. Learn how to identify dark vs. milk chocolate danger levels, calculate toxicity thresholds, and take immediate life-saving action.',
    category: 'first-aid',
    urgency: 'emergency',
    readTimeMinutes: 5,
    vetReviewedBy: 'Eternal Paws Veterinary Research Desk',
    vetCredentials: 'Corroborated with ASPCA Animal Poison Control & Merck Veterinary Manual',
    lastReviewedAt: '2026-08-30',
    keyTakeaways: [
      'Baking chocolate and dark cocoa powder are the most lethal forms per ounce.',
      'Symptoms begin 6 to 12 hours after ingestion and escalate to cardiac arrhythmias.',
      'NEVER induce vomiting with hydrogen peroxide without direct veterinary authorization.',
      'Immediate veterinary decontamination within 2 hours prevents systemic theobromine absorption.',
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80',
      altText: 'Dark chocolate pieces on warning table',
      credit: 'Unsplash Medical Photography Archive',
    },
    overview: 'Chocolate toxicity in canines is caused by methylxanthines—specifically theobromine and caffeine. While humans metabolize these compounds rapidly, dogs process them very slowly, causing severe central nervous system stimulation, acute peripheral vasoconstriction, elevated heart rate (tachycardia), and lethal cardiac arrhythmias.',
    symptomsOrSigns: [
      {
        title: 'Mild Toxicity (Phase 1: 0 - 4 Hours)',
        description: 'Extreme thirst, panting, pacing, restlessness, vomiting, and diarrhea.',
        isSevere: false,
      },
      {
        title: 'Moderate Toxicity (Phase 2: 4 - 8 Hours)',
        description: 'Tachycardia (racing pulse >160 bpm), muscle twitching, urinary incontinence, and rigid stance.',
        isSevere: true,
      },
      {
        title: 'Severe Toxicity (Phase 3: 8+ Hours)',
        description: 'Continuous muscle tremors, tonic-clonic seizures, hyperthermia (>104°F), and sudden cardiovascular collapse.',
        isSevere: true,
      },
    ],
    actionProtocol: [
      {
        stepNumber: 1,
        title: 'Identify the Exact Chocolate Type and Approximate Ounces Consumed',
        instructions: 'Locate the wrapper or packaging immediately. Cocoa powder and 85%+ dark baker’s chocolate have 8x more theobromine than milk chocolate. Note the exact time of ingestion.',
      },
      {
        stepNumber: 2,
        title: 'Call the Emergency Hotline or Nearest 24/7 Animal Hospital',
        instructions: 'Contact your nearest 24/7 veterinary emergency clinic or the ASPCA Animal Poison Control Center at (888) 426-4435. State your dog’s weight, the chocolate type, and ounces eaten.',
        cautionNote: 'Do not wait for clinical symptoms to appear before calling.',
      },
      {
        stepNumber: 3,
        title: 'Transport Safely for Activated Charcoal & IV Fluid Therapy',
        instructions: 'Veterinarians will administer medical emetics (such as apomorphine or ropinirole eye drops) followed by activated charcoal with sorbitol to bind remaining toxins in the gastrointestinal tract.',
      },
    ],
    whenToCallVet: [
      'Any ingestion of dark chocolate, baker’s chocolate, or cocoa powder by any size dog.',
      'A small dog (<20 lbs) ingesting more than 1.5 oz of milk chocolate.',
      'Any signs of restlessness, pacing, muscle tremors, or elevated heart rate.',
    ],
    faq: [
      {
        question: 'How much chocolate is lethal to a 50 lb dog?',
        answer: 'For a 50-pound dog, as little as 1 ounce of baker’s cocoa powder or 4 ounces of 70% dark chocolate can induce severe cardiac toxicity and seizures. 16 ounces of milk chocolate is required for equivalent toxicity.',
      },
      {
        question: 'Can I give my dog hydrogen peroxide at home to make him throw up?',
        answer: 'Veterinary emergency consensus advises against routine at-home peroxide administration because it frequently causes severe hemorrhagic gastritis and aspiration pneumonia. Always consult a veterinarian first.',
      },
    ],
    sources: [
      {
        name: 'ASPCA Animal Poison Control Center (APCC) Clinical Guidelines',
        url: 'https://www.aspca.org/pet-care/animal-poison-control',
        organization: 'American Society for the Prevention of Cruelty to Animals',
      },
      {
        name: 'Merck Veterinary Manual: Toxicology of Methylxanthines in Animals',
        url: 'https://www.merckvetmanual.com',
        organization: 'Merck Veterinary Editorial Board',
      },
    ],
  },
  {
    id: 'guide-canine-heatstroke',
    slug: 'canine-heatstroke-symptoms-emergency-cooling',
    title: 'Canine Heatstroke: How to Recognize Early Signs and Cool Your Dog Safely',
    subtitle: 'The critical difference between safe evaporative cooling and dangerous ice water shock.',
    excerpt: 'Heatstroke in dogs is a life-threatening medical emergency where internal core temperature exceeds 104°F. Learn the life-saving evaporative cooling technique that prevents organ failure.',
    category: 'first-aid',
    urgency: 'emergency',
    readTimeMinutes: 5,
    vetReviewedBy: 'Eternal Paws Veterinary Research Desk',
    vetCredentials: 'Corroborated with AVMA Emergency & Critical Care Guidelines',
    lastReviewedAt: '2026-08-30',
    keyTakeaways: [
      'Dogs only sweat through paw pads and regulate 90% of body heat via panting.',
      'NEVER submerge a heatstroke dog in ice water—it causes peripheral vasoconstriction, trapping core heat.',
      'Use cool (lukewarm to room temperature) water on paws, neck, and groin with a running fan.',
      'Stop active cooling once internal temperature reaches 103°F to prevent rebound hypothermia.',
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=80',
      altText: 'Dog resting in shade with water bowl on hot sunny day',
      credit: 'Unsplash Canine Archive',
    },
    overview: 'Canine hyperthermia occurs when heat production overwhelms heat dissipation mechanisms. When a dog’s core body temperature surpasses 104°F (40°C), cellular thermal injury begins, leading to systemic inflammatory response syndrome (SIRS), disseminated intravascular coagulation (DIC), and acute renal failure within sixty minutes.',
    symptomsOrSigns: [
      {
        title: 'Early Warning (Heat Exhaustion: 103°F - 104°F)',
        description: 'Heavy, loud panting, thick ropey saliva, brick-red gums, and wide anxious eyes.',
        isSevere: false,
      },
      {
        title: 'Critical Emergency (Heatstroke: 104°F - 106°F)',
        description: 'Vomiting, bloody diarrhea, staggering (ataxia), weakness, collapse, and glazed eyes.',
        isSevere: true,
      },
      {
        title: 'Late Stage Thermal Crisis (106°F+)',
        description: 'Seizures, stupor, pale/gray gums, pinpoint petechiae bruising on belly, and coma.',
        isSevere: true,
      },
    ],
    actionProtocol: [
      {
        stepNumber: 1,
        title: 'Move to Air-Conditioned Environment Immediately',
        instructions: 'Carry the dog out of direct sunlight into an air-conditioned room or vehicle with maximum AC airflow.',
      },
      {
        stepNumber: 2,
        title: 'Apply Cool Tap Water to High-Vascularity Zones',
        instructions: 'Soak towels in cool (room temperature / tap) water and apply them to the footpads, inner groin, armpits, and back of neck. Turn on an electric fan directed at the dog.',
        cautionNote: 'NEVER use ice water or ice baths. Ice causes surface blood vessels to constrict, locking heat inside vital organs.',
      },
      {
        stepNumber: 3,
        title: 'Rush to 24/7 Veterinary Hospital with Vehicle AC on Maximum',
        instructions: 'Even if the dog appears to recover after cooling, internal microvascular clotting and kidney failure can develop 24 to 48 hours later. Comprehensive blood gas and organ screening is mandatory.',
      },
    ],
    whenToCallVet: [
      'Any time a dog collapses, stumbles, or vomits after outdoor exercise in warm weather.',
      'Rectal temperature exceeds 104.0°F.',
      'Brachycephalic breeds (Pugs, Bulldogs, Boxers) panting frantically after short walks.',
    ],
    faq: [
      {
        question: 'Why are flat-faced (brachycephalic) dogs at 10x higher risk of heatstroke?',
        answer: 'Brachycephalic dogs have elongated soft palates, narrowed nostrils (stenotic nares), and restricted airways that prevent efficient air exchange, making effective panting nearly impossible in humidity above 60%.',
      },
      {
        question: 'How long can a dog survive inside a parked car on an 80°F day?',
        answer: 'Inside a parked car on an 80°F (27°C) day, interior temperatures reach 99°F in 10 minutes and 109°F in 20 minutes, even with cracked windows. Heatstroke can be fatal in under 15 minutes.',
      },
    ],
    sources: [
      {
        name: 'Journal of Veterinary Emergency and Critical Care: Pathophysiology and Management of Canine Heatstroke',
        url: 'https://onlinelibrary.wiley.com/journal/14764431',
        organization: 'Veterinary Emergency and Critical Care Society (VECCS)',
      },
      {
        name: 'American Veterinary Medical Association (AVMA): Warm Weather Pet Safety',
        url: 'https://www.avma.org',
        organization: 'AVMA Clinical Board',
      },
    ],
  },

  // ==================== BEHAVIOR & NEUROSCIENCE ====================
  {
    id: 'guide-why-dogs-lean',
    slug: 'why-does-my-dog-lean-on-me-behavior-meaning',
    title: 'Why Does My Dog Lean Against My Legs? The Veterinary Neuroscience Explained',
    subtitle: 'From emotional security and oxytocin bonding to subtle tactile communication.',
    excerpt: 'When your dog leans their full body weight against your legs, they are engaging in a complex canine behavioral display. Learn the four neurological and emotional reasons behind this beloved behavior.',
    category: 'behavior',
    urgency: 'informational',
    readTimeMinutes: 4,
    vetReviewedBy: 'Eternal Paws Veterinary Research Desk',
    vetCredentials: 'Corroborated with Applied Animal Ethology & Neuroscience Research',
    lastReviewedAt: '2026-08-30',
    keyTakeaways: [
      'Leaning is primarily a canine emotional bonding gesture that releases oxytocin in both species.',
      'It represents a canine "hug" and tactile social security affirmation.',
      'In rare cases, sudden persistent leaning accompanied by stiff posture can indicate anxiety or joint pain.',
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
      altText: 'Loyal dog gently leaning its head on human owner knee',
      credit: 'Unsplash Dog Bond Photography Archive',
    },
    overview: 'Canine body language is nuanced, and physical contact is one of the primary channels dogs use to establish social cohesion. When a dog leans their torso against a human companion, fMRI brain imaging shows activation in the caudate nucleus—the brain’s reward and positive emotional center.',
    symptomsOrSigns: [
      {
        title: '1. The Canine "Physical Hug" & Affection',
        description: 'Dogs do not naturally hug with forelimbs. Pressing body weight against trusted humans is the biological equivalent of an embrace, triggering bilateral oxytocin release.',
      },
      {
        title: '2. Scent & Security Anchoring',
        description: 'In unfamiliar environments or around strangers, leaning allows a dog to anchor themselves to their perceived pack leader for reassurance.',
      },
      {
        title: '3. Attention & Interactive Communication',
        description: 'Dogs quickly learn that leaning results in gentle eye contact, head scratches, and soothing verbal praise.',
      },
    ],
    actionProtocol: [
      {
        stepNumber: 1,
        title: 'Observe Overall Body Language (Relaxed vs Tense)',
        instructions: 'Look at the dog’s tail, ears, and eyes. A relaxed lean has a soft tail wag, open mouth, and soft eyes. A tense lean features pinned ears and lip licking.',
      },
      {
        stepNumber: 2,
        title: 'Reward Affection with Gentle Chest or Neck Scratches',
        instructions: 'Gently pet the dog’s side or chest. Avoid patting the top of the head firmly, which can feel slightly intimidating.',
      },
    ],
    whenToCallVet: [
      'If the leaning is sudden, accompanied by reluctance to bear weight on a specific leg, or whining when touched (indicating hip dysplasia or arthritis).',
      'If leaning occurs alongside pacing, dilated pupils, and trembling during quiet indoor hours.',
    ],
    faq: [
      {
        question: 'Does my dog lean on me to show dominance?',
        answer: 'No. Modern veterinary behavioral science has completely debunked the outdated "dominance" myth. Leaning is an affiliative social bonding behavior rooted in trust and affection.',
      },
      {
        question: 'Why do certain breeds (like Great Danes and Rottweilers) lean more than others?',
        answer: 'Large and giant working breeds were historically bred for close physical proximity to humans (such as drafting or livestock guarding). They have strong genetic predispositions toward full-body tactile contact.',
      },
    ],
    sources: [
      {
        name: 'Applied Animal Behaviour Science: Human-Dog Oxytocin Feedback Loop in Social Interaction',
        url: 'https://www.sciencedirect.com/journal/applied-animal-behaviour-science',
        organization: 'International Society for Applied Ethology',
      },
      {
        name: 'American College of Veterinary Behaviorists (ACVB) Clinical Resource Library',
        url: 'https://www.dacvb.org',
        organization: 'ACVB Board of Regents',
      },
    ],
  },
  {
    id: 'guide-dog-bloat-gdv',
    slug: 'dog-bloat-gdv-early-warning-signs',
    title: 'Dog Bloat & GDV: The 3 Early Warning Signs Every Dog Owner Must Know',
    subtitle: 'Why minutes matter in gastric dilatation-volvulus and how to save your dog’s life.',
    excerpt: 'Gastric Dilatation-Volvulus (GDV) is the fastest-killing non-traumatic emergency in veterinary medicine. Learn the hallmark non-productive retching symptom and surgical prevention protocols.',
    category: 'first-aid',
    urgency: 'emergency',
    readTimeMinutes: 5,
    vetReviewedBy: 'Eternal Paws Veterinary Research Desk',
    vetCredentials: 'Corroborated with ACVS Surgical Guidelines & JAVMA Literature',
    lastReviewedAt: '2026-08-30',
    keyTakeaways: [
      'GDV occurs when the stomach fills with gas and twists on its mesenteric axis, cutting off blood supply.',
      'Hallmark symptom: Non-productive retching (trying to vomit every 2 minutes with nothing coming up).',
      'Large deep-chested breeds (Great Danes, German Shepherds, Standard Poodles) are at highest risk.',
      'Prophylactic gastropexy during routine spay/neuter reduces GDV mortality risk by 95%.',
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5455?auto=format&fit=crop&w=1200&q=80',
      altText: 'Deep-chested German Shepherd resting alertly',
      credit: 'Unsplash Clinical Dog Archive',
    },
    overview: 'Gastric Dilatation-Volvulus (GDV), commonly called "Bloat," is an acute, surgical emergency where the stomach rapidly distends with gas, fluid, and food, and subsequently rotates 180 to 360 degrees. This torsion obstructs the caudal vena cava, severely compromising venous return to the heart and causing tissue necrosis of the gastric wall and spleen.',
    symptomsOrSigns: [
      {
        title: '1. Non-Productive Retching (The #1 Indicator)',
        description: 'The dog dry-heaves or gags violently every 2 to 3 minutes, producing only small amounts of white foam.',
        isSevere: true,
      },
      {
        title: '2. Distended, Tight "Drum-Like" Abdomen',
        description: 'The stomach behind the rib cage becomes visibly swollen, firm, and makes a hollow drum sound when gently tapped.',
        isSevere: true,
      },
      {
        title: '3. Extreme Restlessness & "Prayer Position"',
        description: 'The dog cannot lie down comfortably, stretches front paws forward with rear end up, and pants rapidly.',
        isSevere: true,
      },
    ],
    actionProtocol: [
      {
        stepNumber: 1,
        title: 'Do NOT Wait or Attempt Home Remedies',
        instructions: 'Never administer gas-relief medications (like simethicone) or attempt to pass a tube at home. If the stomach has rotated, gas cannot escape.',
      },
      {
        stepNumber: 2,
        title: 'Call the Nearest Emergency Veterinary Hospital En Route',
        instructions: 'Call the hospital while driving so the surgical and triage team can prepare IV catheters, shock fluid resuscitation, and emergency decompression needles before your arrival.',
      },
    ],
    whenToCallVet: [
      'IMMEDIATELY if a dog exhibits dry retching or abdominal distension.',
      'Within minutes if a deep-chested dog becomes restless and drools excessively after eating.',
    ],
    faq: [
      {
        question: 'What is prophylactic gastropexy and should I get it for my dog?',
        answer: 'Prophylactic gastropexy is a minimally invasive surgical procedure where the stomach wall is permanently tacked to the abdominal body wall. It prevents the stomach from twisting and is strongly recommended for high-risk deep-chested breeds.',
      },
      {
        question: 'Does eating from an elevated bowl cause bloat?',
        answer: 'Large-scale epidemiological studies published in JAVMA found that elevated feeding bowls actually increased the risk of GDV in large dogs by over 100%. Feeding at floor level with slow-feeder bowls is currently recommended.',
      },
    ],
    sources: [
      {
        name: 'Journal of the American Veterinary Medical Association (JAVMA): Analysis of Risk Factors for GDV in Dogs',
        url: 'https://avmajournals.avma.org/journal/javma',
        organization: 'American Veterinary Medical Association',
      },
      {
        name: 'American College of Veterinary Surgeons (ACVS): Gastric Dilatation-Volvulus Overview',
        url: 'https://www.acvs.org/small-animal/gastric-dilatation-volvulus',
        organization: 'ACVS Surgical Guidelines',
      },
    ],
  },
  {
    id: 'guide-why-dogs-lick-paws',
    slug: 'why-is-my-dog-licking-paws-causes-treatments',
    title: 'Why Is My Dog Constantly Licking His Paws? Causes, Allergies & Solutions',
    subtitle: 'From environmental yeast dermatitis to anxiety and interdigital cysts.',
    excerpt: 'Obsessive paw licking is one of the most common veterinary complaints. Learn how to distinguish environmental pollen allergies, Malassezia yeast infections, and behavioral stress.',
    category: 'behavior',
    urgency: 'moderate',
    readTimeMinutes: 4,
    vetReviewedBy: 'Eternal Paws Veterinary Research Desk',
    vetCredentials: 'Corroborated with ACVD Dermatology & ESVD Clinical Literature',
    lastReviewedAt: '2026-08-30',
    keyTakeaways: [
      'Chronic paw licking is rarely a simple grooming habit; it indicates underlying itch or pain.',
      'Environmental allergies (grass, tree pollen, dust mites) trigger 70% of canine pododermatitis.',
      'Rusty reddish-brown staining between toe pads is caused by porphyrin pigments in saliva and yeast.',
      'Foot soaks with diluted chlorhexidine or apple cider vinegar soothe secondary yeast overgrowth.',
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
      altText: 'Dog sitting calmly outdoors showing clean healthy paws',
      credit: 'Unsplash Veterinary Dermatology Archive',
    },
    overview: 'Canine pododermatitis (paw inflammation) triggers intense pruritus (itching) that compels dogs to lick and chew their paws. The warm, moist environment created by constant licking promotes secondary bacterial (Staphylococcus) and fungal (Malassezia yeast) overgrowth, creating a vicious cycle of irritation.',
    symptomsOrSigns: [
      {
        title: '1. Reddish-Brown Fur Discoloration',
        description: 'Porphyrin compounds in dog saliva react with light and oxygen, dyeing white or light fur rusty brown.',
      },
      {
        title: '2. Sweet, Corn Chip (Fritos) Odor',
        description: 'A distinct yeast smell emanating from between the toe pads confirms active Malassezia microbial proliferation.',
      },
      {
        title: '3. Interdigital Cysts or Swelling',
        description: 'Puffy, red bumps between the toes caused by foreign bodies (foxtails) or deep follicular inflammation.',
      },
    ],
    actionProtocol: [
      {
        stepNumber: 1,
        title: 'Inspect Paws for Foxtails, Ticks, or Cuts',
        instructions: 'Use a flashlight to carefully spread the toes and check the webbed skin for thorn punctures, foxtail grass awns, or cracked pads.',
      },
      {
        stepNumber: 2,
        title: 'Wipe Paws After Every Outdoor Walk',
        instructions: 'Use hypoallergenic grooming wipes or a damp microfiber cloth to remove grass pollen, lawn fertilizers, and de-icing road salts immediately after walks.',
      },
      {
        stepNumber: 3,
        title: 'Consult Vet for Cytology & Targeted Anti-Pruritic Therapy',
        instructions: 'Your veterinarian can perform a quick tape-strip cytology to identify whether bacteria or yeast predominate, and prescribe targeted therapies like Cytopoint injections or Apoquel.',
      },
    ],
    whenToCallVet: [
      'If the paw is hot to the touch, swollen, bleeding, or producing yellowish discharge.',
      'If the dog is limping or refusing to place full weight on the paw.',
      'If licking has created raw, hairless "hot spots" on the top of the foot.',
    ],
    faq: [
      {
        question: 'Why do my dog’s paws smell like corn chips (Fritos)?',
        answer: 'The corn chip scent is caused by naturally occurring skin bacteria (Proteus and Pseudomonas) and Malassezia yeast. A slight smell is normal, but an intense pungent odor accompanied by redness indicates overgrowth requiring medicated topical wipes.',
      },
      {
        question: 'Can food allergies make dogs lick their paws?',
        answer: 'Yes. Cutaneous adverse food reactions (commonly to chicken, beef, or dairy proteins) frequently manifest as inflamed ears and itchy paws. An 8-week strict veterinary elimination diet trial can confirm food sensitivities.',
      },
    ],
    sources: [
      {
        name: 'Veterinary Dermatology Journal: Pathogenesis and Management of Canine Atopic Dermatitis',
        url: 'https://onlinelibrary.wiley.com/journal/13653164',
        organization: 'European Society of Veterinary Dermatology (ESVD)',
      },
      {
        name: 'American College of Veterinary Dermatology (ACVD) Paw Care Clinical Guidelines',
        url: 'https://www.acvd.org',
        organization: 'ACVD Board',
      },
    ],
  },
  {
    id: 'guide-senior-dog-joint-care',
    slug: 'natural-joint-care-arthritis-senior-dogs',
    title: 'Senior Dog Joint Care: Natural Arthritis Relief, Supplements & Mobility Guide',
    subtitle: 'How to keep your aging dog active, pain-free, and comfortable with veterinary science.',
    excerpt: 'Over 80% of dogs over age eight suffer from osteoarthritis. Discover evidence-based multimodal pain management, EPA/DHA Omega-3 dosing, and home environmental modifications.',
    category: 'senior-care',
    urgency: 'informational',
    readTimeMinutes: 5,
    vetReviewedBy: 'Eternal Paws Veterinary Research Desk',
    vetCredentials: 'Corroborated with AAHA Pain Management & BVA Clinical Literature',
    lastReviewedAt: '2026-08-30',
    keyTakeaways: [
      'Canine osteoarthritis is a chronic degenerative joint disease requiring multimodal management.',
      'High-potency marine Omega-3 fatty acids (EPA & DHA) reduce inflammatory prostaglandins.',
      'Non-slip runner rugs over hardwood floors prevent terrifying slip-and-fall injuries in senior dogs.',
      'Low-impact controlled exercises (swimming, gentle 15-minute sniff walks) maintain vital muscle mass.',
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80',
      altText: 'Senior dog with sweet gray muzzle resting on supportive orthopedic bed',
      credit: 'Unsplash Senior Dog Archive',
    },
    overview: 'Osteoarthritis (OA) involves the progressive degradation of articular cartilage, subchondral bone remodeling, and chronic joint capsule synovitis. Because dogs instinctively mask discomfort, subtle behavioral changes like hesitating before stairs or sleeping more are often the earliest signs of joint stiffness.',
    symptomsOrSigns: [
      {
        title: '1. Morning Stiffness & "Bunny-Hopping"',
        description: 'Difficulty standing after naps that improves slightly after walking for a few minutes.',
      },
      {
        title: '2. Reluctance to Climb Stairs or Jump into Cars',
        description: 'Hesitation, pacing before steps, or waiting to be lifted onto couches.',
      },
      {
        title: '3. Muscle Atrophy in Hindquarters',
        description: 'Loss of thigh muscle mass and narrowing of the hips as the dog shifts weight to front legs.',
      },
    ],
    actionProtocol: [
      {
        stepNumber: 1,
        title: 'Install Non-Slip Runner Rugs on Hardwood / Tile Floors',
        instructions: 'Slick flooring creates fear of falling. Lay rubber-backed runner rugs along primary walking paths from the bed to food bowls and back doors.',
      },
      {
        stepNumber: 2,
        title: 'Provide a Medical-Grade Orthopedic Memory Foam Bed',
        instructions: 'Ensure beds have at least 4 inches of high-density therapeutic memory foam that supports joints without bottoming out to the hard floor.',
      },
      {
        stepNumber: 3,
        title: 'Start Evidence-Based Marine Omega-3 & Joint Supplements',
        instructions: 'Administer veterinary-grade liquid fish oil providing 100 mg EPA/DHA per 10 lbs body weight alongside Green-Lipped Mussel (GLM) and Glucosamine/Chondroitin.',
      },
    ],
    whenToCallVet: [
      'If your senior dog yelps when rising or snaps when his hips/spine are touched.',
      'If there is sudden inability to support weight on any limb.',
      'To discuss modern targeted anti-NGF monoclonal antibody therapies (like monthly Librela injections).',
    ],
    faq: [
      {
        question: 'What is Librela (bedinvetmab) and is it safe for senior dogs?',
        answer: 'Librela is an FDA-approved monthly injectable monoclonal antibody that targets Nerve Growth Factor (NGF) to block pain signals without metabolizing through the liver or kidneys like traditional NSAIDs. Consult your veterinarian to see if your senior dog is a candidate.',
      },
      {
        question: 'How does weight loss help canine arthritis?',
        answer: 'Adipose (fat) tissue actively secretes pro-inflammatory cytokines into the bloodstream. Losing just 6% to 8% of body weight dramatically reduces mechanical load and biological joint inflammation.',
      },
    ],
    sources: [
      {
        name: 'Journal of the American Animal Hospital Association (JAAHA): Canine Arthritis Guidelines',
        url: 'https://www.aaha.org',
        organization: 'American Animal Hospital Association',
      },
      {
        name: 'Veterinary Record: Marine Omega-3 Fatty Acids in Canine Osteoarthritis Management',
        url: 'https://bvajournals.onlinelibrary.wiley.com/journal/20427670',
        organization: 'British Veterinary Association',
      },
    ],
  },
];

export function getWellnessGuideBySlug(slug: string): WellnessGuide | undefined {
  return allWellnessGuides.find((g) => g.slug === slug);
}

export function getWellnessGuidesByCategory(category: WellnessCategory): WellnessGuide[] {
  return allWellnessGuides.filter((g) => g.category === category);
}
