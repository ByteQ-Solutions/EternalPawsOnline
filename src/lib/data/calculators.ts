/**
 * Eternal Paws Platform - Clinical Veterinary Calculator Formulas & Models
 * Path: src/lib/data/calculators.ts
 * 
 * Peer-reviewed clinical formulas for canine toxicology (ASPCA/Merck)
 * and non-linear life-stage age curves (AVMA).
 */

// ==========================================
// 1. CHOCOLATE TOXICITY CALCULATOR DATA & LOGIC
// ==========================================

export type ChocolateType =
  | 'white'
  | 'milk'
  | 'dark_low'
  | 'dark_high'
  | 'bakers'
  | 'cocoa_powder'
  | 'cocoa_beans';

export interface ChocolateTypeInfo {
  id: ChocolateType;
  name: string;
  emoji: string;
  description: string;
  theobromineMgPerOz: number; // mg of theobromine per ounce
  caffeineMgPerOz: number;     // mg of caffeine per ounce
  relativeToxicity: 'Negligible' | 'Moderate' | 'High' | 'Extremely High' | 'Lethal';
}

export const CHOCOLATE_TYPES: Record<ChocolateType, ChocolateTypeInfo> = {
  white: {
    id: 'white',
    name: 'White Chocolate',
    emoji: '⚪',
    description: 'Negligible theobromine, but high fat/sugar risk (pancreatitis).',
    theobromineMgPerOz: 0.25,
    caffeineMgPerOz: 0.85,
    relativeToxicity: 'Negligible',
  },
  milk: {
    id: 'milk',
    name: 'Milk Chocolate',
    emoji: '🍫',
    description: 'Standard chocolate bars, Hershey’s, M&Ms, chocolate chips.',
    theobromineMgPerOz: 58,
    caffeineMgPerOz: 6,
    relativeToxicity: 'Moderate',
  },
  dark_low: {
    id: 'dark_low',
    name: 'Semi-Sweet / Dark (45% - 55% Cacao)',
    emoji: '🍫',
    description: 'Semi-sweet baking chips, dark chocolate bars (45-55% cacao).',
    theobromineMgPerOz: 130,
    caffeineMgPerOz: 15,
    relativeToxicity: 'High',
  },
  dark_high: {
    id: 'dark_high',
    name: 'Bittersweet / High Dark (70% - 85%+ Cacao)',
    emoji: '🟫',
    description: 'Gourmet dark chocolate (70-85%+ cacao), high-potency.',
    theobromineMgPerOz: 200,
    caffeineMgPerOz: 25,
    relativeToxicity: 'Extremely High',
  },
  bakers: {
    id: 'bakers',
    name: 'Baker’s Unsweetened Chocolate (100% Cacao)',
    emoji: '⬛',
    description: 'Unsweetened baking blocks, 100% pure chocolate solids.',
    theobromineMgPerOz: 390,
    caffeineMgPerOz: 47,
    relativeToxicity: 'Lethal',
  },
  cocoa_powder: {
    id: 'cocoa_powder',
    name: 'Dry Cocoa Powder (Unsweetened)',
    emoji: '☕',
    description: 'Dry baking cocoa powder (highest theobromine concentration).',
    theobromineMgPerOz: 737,
    caffeineMgPerOz: 70,
    relativeToxicity: 'Lethal',
  },
  cocoa_beans: {
    id: 'cocoa_beans',
    name: 'Cocoa Bean Mulch / Nibs',
    emoji: '🌱',
    description: 'Garden cocoa mulch, raw roasted cacao nibs.',
    theobromineMgPerOz: 550,
    caffeineMgPerOz: 60,
    relativeToxicity: 'Lethal',
  },
};

export type ToxicitySeverity = 'safe' | 'mild' | 'moderate' | 'severe' | 'critical';

export interface ChocolateToxicityResult {
  totalMethylxanthinesMg: number; // Total theobromine + caffeine in mg
  doseMgPerKg: number;            // Dose in mg/kg of dog body weight
  severity: ToxicitySeverity;
  headline: string;
  summary: string;
  expectedSymptoms: string[];
  actionRequired: string;
  timeline: string;
  isEmergency: boolean;
}

/**
 * Calculates exact theobromine + caffeine dose (mg/kg) using ASPCA clinical veterinary criteria.
 * @param dogWeightLbs Dog weight in pounds
 * @param chocolateType Type of chocolate
 * @param amountOz Amount eaten in ounces
 */
export function calculateChocolateToxicity(
  dogWeightLbs: number,
  chocolateType: ChocolateType,
  amountOz: number
): ChocolateToxicityResult {
  const safeWeightLbs = Math.max(1, dogWeightLbs);
  const weightKg = safeWeightLbs * 0.45359237;

  const info = CHOCOLATE_TYPES[chocolateType] || CHOCOLATE_TYPES.milk;
  const totalTheobromineMg = amountOz * info.theobromineMgPerOz;
  const totalCaffeineMg = amountOz * info.caffeineMgPerOz;
  const totalMethylxanthinesMg = totalTheobromineMg + totalCaffeineMg;

  const doseMgPerKg = totalMethylxanthinesMg / weightKg;

  if (doseMgPerKg < 20) {
    return {
      totalMethylxanthinesMg: Math.round(totalMethylxanthinesMg),
      doseMgPerKg: Math.round(doseMgPerKg * 10) / 10,
      severity: 'safe',
      headline: 'Low Risk / Mild Gastrointestinal Reaction Likely',
      summary: `The calculated dose (${doseMgPerKg.toFixed(1)} mg/kg) is below the clinical threshold for cardiovascular toxicity. Your dog may experience mild stomach upset from fat or sugar content.`,
      expectedSymptoms: [
        'Mild diarrhea or soft stool within 6 to 12 hours.',
        'Slight vomiting or reduced appetite.',
        'Increased thirst due to sugar content.',
      ],
      actionRequired: 'Monitor your dog at home for 24 hours. Ensure free access to fresh water. If vomiting is repetitive, consult your vet.',
      timeline: 'Symptoms typically resolve within 12 to 24 hours without medical intervention.',
      isEmergency: false,
    };
  }

  if (doseMgPerKg >= 20 && doseMgPerKg < 40) {
    return {
      totalMethylxanthinesMg: Math.round(totalMethylxanthinesMg),
      doseMgPerKg: Math.round(doseMgPerKg * 10) / 10,
      severity: 'mild',
      headline: 'Moderate Toxicity Risk: Cardiotoxicity Threshold',
      summary: `The calculated dose (${doseMgPerKg.toFixed(1)} mg/kg) crosses the clinical threshold where heart rate stimulation and systemic agitation occur.`,
      expectedSymptoms: [
        'Rapid panting and noticeable restlessness/pacing.',
        'Elevated heart rate (tachycardia) and dilated pupils.',
        'Frequent urination and moderate vomiting or diarrhea.',
      ],
      actionRequired: 'Call your veterinarian or ASPCA Animal Poison Control ((888) 426-4435). Induction of vomiting by a veterinary professional may be recommended if ingested under 2 hours ago.',
      timeline: 'Peak clinical onset occurs 4 to 12 hours after ingestion. Effects can persist for up to 72 hours.',
      isEmergency: true,
    };
  }

  if (doseMgPerKg >= 40 && doseMgPerKg < 60) {
    return {
      totalMethylxanthinesMg: Math.round(totalMethylxanthinesMg),
      doseMgPerKg: Math.round(doseMgPerKg * 10) / 10,
      severity: 'severe',
      headline: 'Severe Toxicity Risk: Neurotoxicity & Arrhythmia Danger',
      summary: `The calculated dose (${doseMgPerKg.toFixed(1)} mg/kg) is dangerous and can trigger serious neurological symptoms, muscle tremors, and cardiac arrhythmias.`,
      expectedSymptoms: [
        'Muscle tremors, twitching, and ataxia (stumbling/wobbliness).',
        'Severe tachycardia, heart palpitations, and hyperthermia (high fever).',
        'Marked agitation, stiffness, and excessive vocalization.',
      ],
      actionRequired: 'RUSH TO A 24/7 EMERGENCY VETERINARY HOSPITAL IMMEDIATELY. Your dog requires IV fluid diuresis, activated charcoal administration, and cardiac monitoring.',
      timeline: 'Symptoms escalate rapidly within 2 to 6 hours. Emergency medical intervention is critical.',
      isEmergency: true,
    };
  }

  return {
    totalMethylxanthinesMg: Math.round(totalMethylxanthinesMg),
    doseMgPerKg: Math.round(doseMgPerKg * 10) / 10,
    severity: 'critical',
    headline: '🚨 CRITICAL EMERGENCY: Potentially Lethal Dose',
    summary: `The calculated dose (${doseMgPerKg.toFixed(1)} mg/kg) is in the potentially fatal range (>=60 mg/kg). Immediate intensive veterinary resuscitation is required to prevent seizures and cardiac arrest.`,
    expectedSymptoms: [
      'Violent full-body seizures and muscle rigidity.',
      'Dangerous cardiac arrhythmias (irregular heartbeat) and collapse.',
      'Internal hemorrhage, respiratory failure, and coma.',
    ],
    actionRequired: 'DO NOT WAIT. Transport your dog immediately to the nearest 24-hour veterinary emergency clinic. Call them while driving so the trauma team can prepare resuscitation protocols.',
    timeline: 'Critical toxicity can cause irreversible cardiovascular collapse within 2 to 4 hours.',
    isEmergency: true,
  };
}

// ==========================================
// 2. DOG AGE IN HUMAN YEARS CALCULATOR
// ==========================================

export type DogBreedSize = 'small' | 'medium' | 'large' | 'giant';

export interface DogBreedSizeInfo {
  id: DogBreedSize;
  name: string;
  weightRange: string;
  sampleBreeds: string;
  seniorAgeThreshold: number; // Age considered senior
}

export const DOG_BREED_SIZES: Record<DogBreedSize, DogBreedSizeInfo> = {
  small: {
    id: 'small',
    name: 'Small Dog',
    weightRange: 'Under 20 lbs (9 kg)',
    sampleBreeds: 'Chihuahua, Dachshund, Pomeranian, Shih Tzu, Yorkshire Terrier',
    seniorAgeThreshold: 11,
  },
  medium: {
    id: 'medium',
    name: 'Medium Dog',
    weightRange: '21 to 50 lbs (9.5 - 23 kg)',
    sampleBreeds: 'Beagle, French Bulldog, Border Collie, Cocker Spaniel',
    seniorAgeThreshold: 10,
  },
  large: {
    id: 'large',
    name: 'Large Dog',
    weightRange: '51 to 90 lbs (23.5 - 41 kg)',
    sampleBreeds: 'Golden Retriever, German Shepherd, Labrador, Boxer, Siberian Husky',
    seniorAgeThreshold: 8,
  },
  giant: {
    id: 'giant',
    name: 'Giant Dog',
    weightRange: 'Over 90 lbs (41+ kg)',
    sampleBreeds: 'Great Dane, Saint Bernard, Mastiff, Newfoundland, Bernese Mountain Dog',
    seniorAgeThreshold: 6,
  },
};

export type DogLifeStage = 'puppy' | 'young_adult' | 'mature_adult' | 'senior' | 'geriatric';

export interface DogAgeResult {
  humanYears: number;
  lifeStage: DogLifeStage;
  lifeStageLabel: string;
  stageDescription: string;
  healthChecklist: string[];
  nutritionRecommendation: string;
  recommendedVetVisitFrequency: string;
}

/**
 * Calculates human age equivalent based on AVMA life-stage guidelines and breed size.
 */
export function calculateDogHumanAge(
  ageYears: number,
  ageMonths: number,
  breedSize: DogBreedSize
): DogAgeResult {
  const totalYears = Math.max(0.1, ageYears + ageMonths / 12);
  let humanYears = 0;

  // AVMA non-linear calculation:
  // Year 1 = ~15 human years for all sizes
  // Year 2 = ~9 human years (Total 24 by age 2)
  // Subsequent years scale according to breed mass and cellular aging rate:
  if (totalYears <= 1) {
    humanYears = totalYears * 15;
  } else if (totalYears <= 2) {
    humanYears = 15 + (totalYears - 1) * 9;
  } else {
    const yearsAfterTwo = totalYears - 2;
    let ratePerYear = 4; // Small dog

    if (breedSize === 'small') {
      ratePerYear = 4.0;
    } else if (breedSize === 'medium') {
      ratePerYear = 4.8;
    } else if (breedSize === 'large') {
      ratePerYear = 5.8;
    } else if (breedSize === 'giant') {
      ratePerYear = 7.5;
    }

    humanYears = 24 + yearsAfterTwo * ratePerYear;
  }

  const roundedHumanAge = Math.round(humanYears);

  // Determine Life Stage
  const sizeInfo = DOG_BREED_SIZES[breedSize];
  let lifeStage: DogLifeStage = 'puppy';
  let lifeStageLabel = '🐾 Puppy (Growth & Socialization)';
  let stageDescription = 'Rapid neurological, skeletal, and behavioral development. Focus on positive reinforcement socialization and core vaccine protocols.';
  let healthChecklist = [
    'Core DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza) & Rabies series.',
    'Monthly broad-spectrum parasite prevention (Heartworm, Fleas, Ticks).',
    'Microchip registration and neuter/spay consultation with your DVM.',
  ];
  let nutritionRecommendation = 'High-protein, DHA-enriched growth formula tailored to puppy breed size to support cognitive and skeletal integrity.';
  let recommendedVetVisitFrequency = 'Every 3-4 weeks until 16 weeks of age, then annual.';

  if (totalYears >= 1 && totalYears < 3) {
    lifeStage = 'young_adult';
    lifeStageLabel = '⚡ Young Adult (Peak Energy & Athleticism)';
    stageDescription = 'Physically mature with peak metabolic energy. Requires structured mental enrichment, athletic exercise, and boundary training.';
    healthChecklist = [
      'Annual comprehensive physical examination and vaccine booster review.',
      'Routine dental plaque evaluation and preventative home tooth brushing.',
      'Heartworm blood testing and continuous preventative dosing.',
    ];
    nutritionRecommendation = 'Balanced adult maintenance formula with moderate fat and high-quality digestible animal proteins.';
    recommendedVetVisitFrequency = 'Annual wellness examination.';
  } else if (totalYears >= 3 && totalYears < sizeInfo.seniorAgeThreshold) {
    lifeStage = 'mature_adult';
    lifeStageLabel = '🐕 Mature Adult (Prime Companionship)';
    stageDescription = 'Established behavioral stability. Maintain healthy body condition score (BCS) to prevent early-onset metabolic disease.';
    healthChecklist = [
      'Annual comprehensive wellness examination with baseline blood and urine chemistry.',
      'Professional veterinary dental cleaning if tartar accumulation is present.',
      'Body weight monitoring to prevent obesity-associated joint strain.',
    ];
    nutritionRecommendation = 'Controlled-calorie adult maintenance diet with added antioxidants and glucosamine support.';
    recommendedVetVisitFrequency = 'Annual wellness examination.';
  } else if (totalYears >= sizeInfo.seniorAgeThreshold && totalYears < sizeInfo.seniorAgeThreshold + 3) {
    lifeStage = 'senior';
    lifeStageLabel = '🦴 Senior Dog (Gentle Mobility & Comfort)';
    stageDescription = 'Age-related metabolic slowing and cartilage remodeling. Early detection of renal, hepatic, and cardiac shifts improves longevity.';
    healthChecklist = [
      'Bi-annual (every 6 months) senior wellness checkups with comprehensive blood panels.',
      'Blood pressure screening and urinalysis for early kidney detection.',
      'Mobility and orthopedic assessment for osteoarthritis intervention.',
    ];
    nutritionRecommendation = 'Easily digestible senior formula fortified with marine EPA/DHA Omega-3s, chondroitin, and L-carnitine.';
    recommendedVetVisitFrequency = 'Bi-annual (Every 6 months).';
  } else if (totalYears >= sizeInfo.seniorAgeThreshold + 3) {
    lifeStage = 'geriatric';
    lifeStageLabel = '👑 Geriatric / Golden Years (Precious Care)';
    stageDescription = 'Advanced life stage requiring focused comfort care, orthopedic support, environmental modifications, and cognitive support.';
    healthChecklist = [
      'Bi-annual or quarterly physical checkups with focus on pain management.',
      'Canine Cognitive Dysfunction (CCD) behavioral assessments.',
      'Orthopedic bed support, non-slip home rugs, and ramp access.',
    ];
    nutritionRecommendation = 'Highly palatable, therapeutic senior diet with elevated moisture and kidney-friendly phosphorus levels.';
    recommendedVetVisitFrequency = 'Every 3 to 6 months.';
  }

  return {
    humanYears: roundedHumanAge,
    lifeStage,
    lifeStageLabel,
    stageDescription,
    healthChecklist,
    nutritionRecommendation,
    recommendedVetVisitFrequency,
  };
}
