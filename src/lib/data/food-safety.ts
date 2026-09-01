/**
 * Eternal Paws Platform - Master Canine Food Safety & Nutrition Database
 * Path: src/lib/data/food-safety.ts
 * 
 * Vet-reviewed nutritional guidance, toxicity indexes, preparation protocols,
 * and Schema.org FAQ structured data for high-ranking programmatic SEO.
 */

export type FoodSafetyStatus = 'safe' | 'moderate' | 'toxic';
export type FoodCategory = 'fruits' | 'vegetables' | 'meats_proteins' | 'dairy_grains' | 'human_foods';

export interface FoodSafetyItem {
  id: string;
  slug: string;
  name: string;
  scientificName?: string;
  emoji: string;
  category: FoodCategory;
  status: FoodSafetyStatus;
  shortVerdict: string;
  quickAnswer: string;
  vetReviewSummary: string;
  benefits: string[];
  risks: string[];
  prepInstructions: string[];
  servingSize: {
    smallDog: string;
    mediumDog: string;
    largeDog: string;
  };
  symptomsIfIngested?: string[];
  faq: {
    question: string;
    answer: string;
  }[];
  heroImage: {
    url: string;
    altText: string;
    credit: string;
  };
}

export const allFoodSafetyItems: FoodSafetyItem[] = [
  // ==================== FRUITS ====================
  {
    id: 'food-apples',
    slug: 'apples',
    name: 'Apples',
    emoji: '🍎',
    category: 'fruits',
    status: 'safe',
    shortVerdict: 'Safe & Healthy (Remove Core & Seeds)',
    quickAnswer: 'Yes! Dogs can safely eat apples. They provide an excellent source of vitamins A and C, dietary fiber, and antioxidants.',
    vetReviewSummary: 'Apples are an affordable, low-calorie, nutrient-dense treat. However, apple seeds contain trace amounts of cyanide and the fibrous core poses a choking hazard, so always slice and core before serving.',
    benefits: [
      'Rich in Vitamin C for immune system support',
      'Packed with Vitamin A for healthy skin, coat, and eye health',
      'High in dietary fiber promoting digestive regularity',
      'Helps clean residue off teeth and freshen breath',
    ],
    risks: [
      'Seeds contain amygdalin (cyanide precursor) — discard all seeds',
      'Hard core can cause intestinal obstruction in small dogs',
      'High natural fructose can upset digestion if overfed',
    ],
    prepInstructions: [
      'Wash thoroughly to remove any pesticide residues',
      'Slice apple into bite-sized wedges or cubes',
      'Carefully remove and discard the stem, hard core, and all seeds',
      'Serve raw, frozen for a cooling treat, or pureed with plain unsweetened dog food',
    ],
    servingSize: {
      smallDog: '1 to 2 thin slices per day',
      mediumDog: '3 to 4 slices per day',
      largeDog: 'Half an apple sliced per day',
    },
    faq: [
      {
        question: 'Can dogs eat apple skin or peel?',
        answer: 'Yes, apple skin is completely safe and contains beneficial antioxidants and fiber. Just wash the apple thoroughly first.',
      },
      {
        question: 'What happens if my dog accidentally eats apple seeds?',
        answer: 'Swallowing 2-3 apple seeds is unlikely to cause toxicity, but chronic ingestion or chewing large quantities of seeds should be avoided. Contact your vet if a large volume was consumed.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh sliced red apples for dogs',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-bananas',
    slug: 'bananas',
    name: 'Bananas',
    emoji: '🍌',
    category: 'fruits',
    status: 'moderate',
    shortVerdict: 'Safe in Moderation (High Sugar Content)',
    quickAnswer: 'Yes, dogs can eat bananas in moderation. They are high in potassium, magnesium, and vitamin B6, but have high natural sugar content.',
    vetReviewSummary: 'Bananas make a wonderful occasional reward or medication pocket. Because of their high sugar and carbohydrate content, feed sparingly to prevent weight gain or gastrointestinal upset.',
    benefits: [
      'Rich in potassium supporting healthy heart and kidney function',
      'Contains Vitamin B6 aiding brain development and hormone regulation',
      'Gentle on sensitive canine stomachs when given in small amounts',
    ],
    risks: [
      'High natural sugar can lead to obesity and tooth decay if overfed',
      'Banana peels are not toxic but are indigestible and cause intestinal blockage',
    ],
    prepInstructions: [
      'Completely peel the banana and discard the skin',
      'Cut into 1/2-inch round slices',
      'Serve fresh or freeze slices for a soothing summer treat',
    ],
    servingSize: {
      smallDog: '1 to 2 slices occasional treat',
      mediumDog: '2 to 3 slices occasional treat',
      largeDog: 'Half a banana maximum per day',
    },
    faq: [
      {
        question: 'Can dogs eat banana peels?',
        answer: 'No. While banana peels are not chemically toxic, they are extremely fibrous and cannot be digested, creating a severe choking and bowel obstruction risk.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh peeled bananas',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-blueberries',
    slug: 'blueberries',
    name: 'Blueberries',
    emoji: '🫐',
    category: 'fruits',
    status: 'safe',
    shortVerdict: 'Superfood Safe & Highly Recommended',
    quickAnswer: 'Yes! Blueberries are an incredible superfood for dogs, packed with anthocyanin antioxidants, vitamin C, and fiber.',
    vetReviewSummary: 'Veterinary nutritionists frequently recommend fresh or frozen blueberries as low-calorie training rewards for dogs of all ages and breeds.',
    benefits: [
      'Powerful anthocyanin antioxidants support cellular health and longevity',
      'Improves cognitive function and memory in aging senior dogs',
      'Low in calories and low glycemic index suitable for weight management',
      'Supports healthy urinary tract function',
    ],
    risks: [
      'Very small choking risk for toy breeds if swallowed whole (mash for tiny pups)',
      'Overconsumption may cause temporary loose stools due to high fiber',
    ],
    prepInstructions: [
      'Rinse fresh blueberries thoroughly in cold water',
      'Feed whole for medium/large dogs, or lightly mashed for toy breeds',
      'Freeze during hot weather for a crunchy hydrating snack',
    ],
    servingSize: {
      smallDog: '2 to 4 berries per day',
      mediumDog: '6 to 8 berries per day',
      largeDog: 'Small handful (10-12 berries) per day',
    },
    faq: [
      {
        question: 'Can diabetic dogs eat blueberries?',
        answer: 'Yes, in strictly controlled quantities. Blueberries have a low glycemic load, but always consult your veterinarian regarding your diabetic dog’s meal plan.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh blueberries bowl',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-watermelon',
    slug: 'watermelon',
    name: 'Watermelon',
    emoji: '🍉',
    category: 'fruits',
    status: 'safe',
    shortVerdict: 'Hydrating & Safe (Remove Rind & Seeds)',
    quickAnswer: 'Yes! Watermelon is 92% water, making it a fantastic hydrating snack rich in vitamins A, B6, and C.',
    vetReviewSummary: 'Watermelon is one of the best summer treats for dogs. Remove all black seeds and the hard green rind to prevent digestive blockage.',
    benefits: [
      '92% water content delivers exceptional hydration on warm days',
      'Packed with lycopene, a potent antioxidant supporting cardiovascular health',
      'Extremely low calorie with natural electrolytes potassium and magnesium',
    ],
    risks: [
      'Watermelon rind is tough and can cause serious intestinal blockage',
      'Seeds can cause intestinal discomfort in smaller dogs',
    ],
    prepInstructions: [
      'Cut away the green and white rind completely',
      'Pick out all black seeds (seedless varieties are ideal)',
      'Cut pink flesh into bite-sized cubes or blend and freeze into popsicles',
    ],
    servingSize: {
      smallDog: '1 to 2 small cubes',
      mediumDog: '3 to 4 cubes',
      largeDog: '1 cup of cubed watermelon',
    },
    faq: [
      {
        question: 'Can dogs eat watermelon rind?',
        answer: 'No. The hard rind cannot be broken down in a dog’s digestive tract and can cause severe gastrointestinal blockage or choking.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh sliced watermelon wedges',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-grapes',
    slug: 'grapes-and-raisins',
    name: 'Grapes & Raisins',
    emoji: '🍇',
    category: 'fruits',
    status: 'toxic',
    shortVerdict: 'STRICTLY TOXIC — Severe Kidney Failure Risk',
    quickAnswer: 'NO! Grapes and raisins are EXTREMELY TOXIC to all dogs. Even a single grape can cause acute, irreversible kidney failure.',
    vetReviewSummary: 'Tartaric acid in grapes and raisins causes sudden renal toxicity in dogs regardless of breed or age. If ingested, seek emergency veterinary care immediately.',
    benefits: ['NONE — Strictly poisonous to dogs.'],
    risks: [
      'Acute, life-threatening kidney failure within 24 to 72 hours',
      'Severe vomiting, lethargy, dehydration, and loss of appetite',
      'Anuria (inability to produce urine) leading to fatal toxicity',
    ],
    prepInstructions: [
      'NEVER FEED. Keep all grapes, raisins, currants, and sultanas strictly out of reach.',
    ],
    servingSize: {
      smallDog: 'ZERO (Toxic)',
      mediumDog: 'ZERO (Toxic)',
      largeDog: 'ZERO (Toxic)',
    },
    symptomsIfIngested: [
      'Vomiting within 2 to 6 hours',
      'Diarrhea and abdominal pain',
      'Extreme weakness, lethargy, and stumbling',
      'Excessive thirst followed by complete lack of urination',
    ],
    faq: [
      {
        question: 'What should I do if my dog ate a grape?',
        answer: 'Do not wait for symptoms. Call your emergency veterinarian or the ASPCA Animal Poison Control Center immediately. Early decontamination within 2 hours saves lives.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1200&q=80',
      altText: 'Toxic grapes warning for dogs',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-strawberries',
    slug: 'strawberries',
    name: 'Strawberries',
    emoji: '🍓',
    category: 'fruits',
    status: 'safe',
    shortVerdict: 'Safe, Healthy & Teeth-Whitening Enzymes',
    quickAnswer: 'Yes! Strawberries are packed with vitamin C, fiber, and an enzyme called malic acid that helps naturally clean canine teeth.',
    vetReviewSummary: 'Strawberries are safe, sweet, and antioxidant-rich. Wash thoroughly and cut into small pieces to prevent choking in smaller dogs.',
    benefits: [
      'High in Vitamin C, potassium, and magnesium',
      'Contains malic acid enzyme which naturally whitens dog teeth',
      'Anti-inflammatory properties supporting joint health',
    ],
    risks: [
      'Whole large strawberries can present a choking hazard to small dogs',
      'High sugar if given in large quantities',
    ],
    prepInstructions: [
      'Remove green leafy stem',
      'Wash thoroughly under cold water',
      'Cut into small quarters or puree over food',
    ],
    servingSize: {
      smallDog: 'Half to 1 strawberry',
      mediumDog: '1 to 2 strawberries',
      largeDog: '3 to 4 strawberries',
    },
    faq: [
      {
        question: 'Can dogs eat strawberry ice cream or jam?',
        answer: 'No. Strawberry jams and ice creams contain dangerous amounts of processed sugar, artificial additives, and potentially toxic xylitol sweeteners.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh sweet strawberries',
      credit: 'Unsplash Food Archive',
    },
  },

  // ==================== VEGETABLES ====================
  {
    id: 'food-carrots',
    slug: 'carrots',
    name: 'Carrots',
    emoji: '🥕',
    category: 'vegetables',
    status: 'safe',
    shortVerdict: 'Outstanding Daily Healthy Dental Treat',
    quickAnswer: 'Yes! Carrots are one of the healthiest, most recommended treats for dogs, rich in beta-carotene and fiber.',
    vetReviewSummary: 'Vets love carrots. Raw carrots act as a natural dental chew that scrapes plaque off teeth, while cooked carrots provide easily digestible vitamin A.',
    benefits: [
      'Loaded with beta-carotene converted into vital Vitamin A',
      'Crunchy texture gently cleans plaque and stimulates gums',
      'Extremely low calorie and virtually fat-free',
      'Supports healthy vision, immune response, and skin health',
    ],
    risks: [
      'Whole large carrots can be a choking hazard for gulpers — slice into sticks or baby carrots',
    ],
    prepInstructions: [
      'Wash and peel if desired',
      'Serve raw as crunchy sticks for chewing or steam lightly without any seasoning',
      'Freeze whole large carrots for teething puppies',
    ],
    servingSize: {
      smallDog: '1 to 2 baby carrots per day',
      mediumDog: '2 to 3 baby carrots or half regular carrot',
      largeDog: '1 whole carrot per day',
    },
    faq: [
      {
        question: 'Are raw or cooked carrots better for dogs?',
        answer: 'Both are great! Raw carrots provide dental benefits from chewing, while lightly steamed carrots allow easier nutrient absorption.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh crunchy orange carrots',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-cucumbers',
    slug: 'cucumbers',
    name: 'Cucumbers',
    emoji: '🥒',
    category: 'vegetables',
    status: 'safe',
    shortVerdict: 'Super Low-Calorie & Hydrating',
    quickAnswer: 'Yes! Cucumbers are 96% water and have almost zero calories, making them perfect for overweight or diabetic dogs.',
    vetReviewSummary: 'Cucumbers contain vitamins K, C, and B1, alongside phytochemicals that combat bad breath and keep dogs hydrated.',
    benefits: [
      '96% water content provides clean hydration',
      'Rich in Vitamin K for blood clotting and bone strength',
      'Contains phytonutrients that eliminate bacteria causing bad breath',
      'Zero fat and ultra-low carbohydrates',
    ],
    risks: [
      'Feeding whole uncut cucumbers can cause choking',
    ],
    prepInstructions: [
      'Wash thoroughly',
      'Slice into thin round coins or sticks',
      'Serve raw or chilled',
    ],
    servingSize: {
      smallDog: '2 to 3 slices',
      mediumDog: '4 to 6 slices',
      largeDog: 'Half a cucumber sliced',
    },
    faq: [
      {
        question: 'Can dogs eat pickles?',
        answer: 'No. Pickles contain high amounts of sodium and are often spiced with garlic or onion powder, which are toxic to dogs.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh sliced green cucumbers',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-onions-garlic',
    slug: 'onions-and-garlic',
    name: 'Onions & Garlic',
    emoji: '🧅',
    category: 'vegetables',
    status: 'toxic',
    shortVerdict: 'STRICTLY TOXIC — Hemolytic Anemia Hazard',
    quickAnswer: 'NO! Onions, garlic, leeks, and chives contain disulfides and thiosulphates that destroy canine red blood cells.',
    vetReviewSummary: 'All members of the Allium family cause oxidative damage to red blood cells (Heinz body anemia). Raw, cooked, powdered, or fried forms are equally dangerous.',
    benefits: ['NONE — Highly toxic to all canines.'],
    risks: [
      'Destruction of red blood cells leading to severe hemolytic anemia',
      'Organ damage due to lack of oxygen delivery to tissues',
      'Lethargy, pale gums, elevated heart rate, and collapse',
    ],
    prepInstructions: [
      'NEVER FEED. Check ingredient labels for onion or garlic powder in broth, baby food, and leftovers.',
    ],
    servingSize: {
      smallDog: 'ZERO (Toxic)',
      mediumDog: 'ZERO (Toxic)',
      largeDog: 'ZERO (Toxic)',
    },
    symptomsIfIngested: [
      'Pale gums and tongue',
      'Rapid breathing and elevated heart rate',
      'Dark reddish-brown urine',
      'Vomiting, diarrhea, and severe lethargy',
    ],
    faq: [
      {
        question: 'Is cooked onion as dangerous as raw onion?',
        answer: 'Yes. Cooking, dehydrating, or powdering onions and garlic does not destroy the toxic compounds. Even small amounts in soup or sauce are hazardous.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=1200&q=80',
      altText: 'Toxic onions warning for pets',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-broccoli',
    slug: 'broccoli',
    name: 'Broccoli',
    emoji: '🥦',
    category: 'vegetables',
    status: 'moderate',
    shortVerdict: 'Safe in Small Amounts (Gas & Isothiocyanate Risk)',
    quickAnswer: 'Yes, in small amounts. Broccoli florets contain isothiocyanates which can cause mild to severe gastric irritation if overfed.',
    vetReviewSummary: 'Broccoli is high in fiber and vitamin C, but should never make up more than 10% of a dog’s daily calorie intake due to gastric gas and irritation risk.',
    benefits: [
      'High in Vitamin C, K, and folate',
      'Rich in lutein supporting eye health and cellular vitality',
    ],
    risks: [
      'Isothiocyanates in florets cause stomach upset and flatulence in large quantities',
      'Hard stems can cause choking if not cut small or steamed',
    ],
    prepInstructions: [
      'Lightly steam without oil, salt, garlic, or butter',
      'Cut into small bite-sized pieces',
      'Feed as an occasional vegetable topper',
    ],
    servingSize: {
      smallDog: '1 small floret',
      mediumDog: '2 small florets',
      largeDog: '3 to 4 small florets',
    },
    faq: [
      {
        question: 'Can dogs eat raw broccoli stalks?',
        answer: 'Stalks are safe if peeled and chopped very small, but steaming makes them much easier for dogs to digest without choking.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh green broccoli florets',
      credit: 'Unsplash Food Archive',
    },
  },

  // ==================== MEATS & PROTEINS ====================
  {
    id: 'food-chicken',
    slug: 'chicken',
    name: 'Cooked Chicken (Boneless)',
    emoji: '🍗',
    category: 'meats_proteins',
    status: 'safe',
    shortVerdict: 'Lean Protein Gold Standard (NEVER Cooked Bones)',
    quickAnswer: 'Yes! Plain, unseasoned cooked chicken is a top-tier lean protein source highly recommended by veterinarians.',
    vetReviewSummary: 'Boneless, skinless cooked chicken is the primary gentle protein for dogs, ideal for building muscle or soothing upset stomachs when paired with white rice.',
    benefits: [
      'High-quality lean protein for strong muscle development',
      'Rich in essential Omega-6 fatty acids for a lustrous coat',
      'Gentle on upset canine stomachs when boiled plain',
    ],
    risks: [
      'NEVER feed cooked chicken bones — they splinter and puncture digestive tracts',
      'Raw chicken carries Salmonella and Campylobacter infection risks',
      'Avoid seasoning, salt, garlic, and heavy skin fat',
    ],
    prepInstructions: [
      'Boil or bake plain without any oils, salt, garlic, or spices',
      'Ensure 100% of bones are removed and discarded',
      'Shred or chop into appropriate bite sizes',
    ],
    servingSize: {
      smallDog: '1 to 2 tablespoons shredded',
      mediumDog: '1/4 cup shredded',
      largeDog: '1/2 cup shredded',
    },
    faq: [
      {
        question: 'Can dogs eat chicken with bones?',
        answer: 'NEVER feed cooked chicken bones. Cooking makes bones brittle and sharp, leading to life-threatening throat and intestinal punctures. Seek emergency care if swallowed.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=1200&q=80',
      altText: 'Lean cooked plain chicken for dogs',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-eggs',
    slug: 'eggs',
    name: 'Cooked Eggs',
    emoji: '🍳',
    category: 'meats_proteins',
    status: 'safe',
    shortVerdict: 'Complete Amino Acid Nutritional Powerhouse',
    quickAnswer: 'Yes! Cooked eggs are packed with bioavailable protein, amino acids, vitamins, and minerals.',
    vetReviewSummary: 'Eggs are one of the most complete protein sources available for dogs. Always cook thoroughly (boiled or scrambled without butter/salt) to prevent biotin deficiency and bacteria.',
    benefits: [
      'Contains all 10 essential amino acids required by canines',
      'Rich in biotin, iron, selenium, and riboflavin for coat shine',
      'Highly digestible energy source for active and recovering dogs',
    ],
    risks: [
      'Raw egg whites contain avidin which interferes with biotin absorption',
      'Do not cook with butter, milk, oil, or seasonings',
    ],
    prepInstructions: [
      'Hard boil or scramble plain in a non-stick pan without oil or salt',
      'Let cool completely before serving',
      'Chop and mix into regular kibble as a protein booster',
    ],
    servingSize: {
      smallDog: 'Half an egg 2-3 times per week',
      mediumDog: '1 whole egg 2-3 times per week',
      largeDog: '1 whole egg daily or every other day',
    },
    faq: [
      {
        question: 'Can dogs eat eggshells?',
        answer: 'Yes! Clean, finely crushed eggshell powder is an excellent natural calcium supplement for dogs on homemade diets.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh farm eggs',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-peanut-butter',
    slug: 'peanut-butter',
    name: 'Peanut Butter (Xylitol-Free)',
    emoji: '🥜',
    category: 'human_foods',
    status: 'moderate',
    shortVerdict: 'Safe & Beloved — Check for Toxic Xylitol!',
    quickAnswer: 'Yes, as long as it does NOT contain Xylitol (birch bark sweetener). Plain peanut butter is packed with protein and healthy fats.',
    vetReviewSummary: 'Dogs love peanut butter and it makes an ideal pill-pocket or Kong filler. CRITICAL: Always check the ingredient list for Xylitol (also labeled Birch Sugar), which is deadly to dogs.',
    benefits: [
      'Excellent high-value treat for training and puzzle toys',
      'Contains heart-healthy monounsaturated fats and Vitamin E',
      'High protein and niacin supporting cellular energy',
    ],
    risks: [
      'XYLITOL / BIRCH SUGAR IS FATAL — causes rapid hypoglycemia and liver necrosis',
      'High calorie and fat content can trigger pancreatitis if overfed',
      'Avoid peanut butters with added salt or hydrogenated oils',
    ],
    prepInstructions: [
      'Inspect ingredient label carefully: only peanuts and salt should be listed',
      'Spread inside interactive chew toys or lick mats',
      'Use a tiny dab to hide veterinary medication capsules',
    ],
    servingSize: {
      smallDog: '1/2 teaspoon maximum per day',
      mediumDog: '1 teaspoon maximum per day',
      largeDog: '1 tablespoon maximum per day',
    },
    symptomsIfIngested: [
      'If Xylitol is ingested: Vomiting, staggering, collapse, seizures within 30 minutes. Rush to emergency vet.',
    ],
    faq: [
      {
        question: 'What is Xylitol and why is it in peanut butter?',
        answer: 'Xylitol is an artificial sugar-alcohol sweetener used in sugar-free and keto products. In dogs, it causes an extreme insulin surge leading to life-threatening low blood sugar and liver failure.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1568651313377-50798e49d63c?auto=format&fit=crop&w=1200&q=80',
      altText: 'Pure natural peanut butter jar',
      credit: 'Unsplash Food Archive',
    },
  },

  // ==================== TOXIC HAZARDS ====================
  {
    id: 'food-chocolate',
    slug: 'chocolate',
    name: 'Chocolate & Cocoa',
    emoji: '🍫',
    category: 'human_foods',
    status: 'toxic',
    shortVerdict: 'STRICTLY TOXIC — Theobromine & Caffeine Hazard',
    quickAnswer: 'NO! Chocolate contains theobromine and caffeine, both of which canines cannot metabolize. Dark and baking chocolate are the most dangerous.',
    vetReviewSummary: 'Theobromine stimulates the central nervous system and cardiovascular system in dogs, causing arrhythmias, seizures, internal bleeding, and heart failure.',
    benefits: ['NONE — Toxic poison to canines.'],
    risks: [
      'Cardiac arrhythmias and life-threatening rapid heart rates',
      'Neurological tremors, muscle spasms, and severe seizures',
      'Internal hemorrhaging and acute mortality',
    ],
    prepInstructions: [
      'NEVER FEED. Store all chocolate, cocoa powder, and baked goods in high, sealed cupboards.',
    ],
    servingSize: {
      smallDog: 'ZERO (Toxic)',
      mediumDog: 'ZERO (Toxic)',
      largeDog: 'ZERO (Toxic)',
    },
    symptomsIfIngested: [
      'Vomiting, diarrhea, and extreme panting',
      'Restlessness, pacing, and excessive thirst',
      'Abnormal heart rhythms, muscle twitching, seizures, collapse',
    ],
    faq: [
      {
        question: 'Which chocolate is the most dangerous to dogs?',
        answer: 'Cocoa powder and dark baker’s chocolate are the most toxic because they contain the highest concentration of theobromine per ounce. Milk chocolate is less concentrated but still dangerous.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80',
      altText: 'Toxic chocolate warning for dogs',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-avocado',
    slug: 'avocado',
    name: 'Avocado',
    emoji: '🥑',
    category: 'fruits',
    status: 'moderate',
    shortVerdict: 'Caution — Pit Choking & Persin Hazard',
    quickAnswer: 'Caution. The large avocado pit presents a severe, life-threatening intestinal obstruction hazard, and the skin/leaves contain persin.',
    vetReviewSummary: 'While a tiny sliver of ripe avocado flesh contains healthy fats, the massive pit is one of the most common surgical foreign bodies removed from dogs. Best avoided.',
    benefits: [
      'Flesh contains Omega-3 and Omega-6 fatty acids supporting coat health',
    ],
    risks: [
      'Avocado pit is a major choking and surgical bowel obstruction emergency',
      'Persin toxin in leaves, skin, and bark causes vomiting and diarrhea',
      'High fat content can trigger acute pancreatitis in sensitive dogs',
    ],
    prepInstructions: [
      'If feeding, use only a tiny sliver of ripe green flesh, completely removed from skin and pit',
      'Keep whole avocados out of dog reach on counters',
    ],
    servingSize: {
      smallDog: 'Not recommended',
      mediumDog: '1 tiny teaspoon flesh only',
      largeDog: '1 tablespoon flesh only',
    },
    faq: [
      {
        question: 'Is avocado oil safe for dogs?',
        answer: 'Pure avocado oil does not contain persin or the pit, but its high fat content means it should only be used in minute drops under veterinary guidance.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh sliced avocado with pit',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-cheese',
    slug: 'cheese',
    name: 'Cheese & Dairy',
    emoji: '🧀',
    category: 'dairy_grains',
    status: 'moderate',
    shortVerdict: 'Safe in Moderation (Lactose & Fat Caution)',
    quickAnswer: 'Yes, in small amounts. Most adult dogs are lactose intolerant, so feed low-lactose cheeses like mozzarella or cottage cheese sparingly.',
    vetReviewSummary: 'Cheese is a high-value training motivator, but excess dairy leads to gas, diarrhea, and pancreatitis due to high saturated fat and lactose.',
    benefits: [
      'High in calcium, protein, and essential fatty acids',
      'Irresistible high-value reward for obedience training and hiding pills',
    ],
    risks: [
      'Lactose intolerance causes bloating, gas, and severe diarrhea',
      'High fat cheeses can trigger acute pancreatitis',
      'High sodium cheeses can elevate canine blood pressure',
    ],
    prepInstructions: [
      'Choose low-fat, low-lactose options: Cottage cheese, low-moisture Mozzarella, or Swiss',
      'Never feed blue cheese (contains roquefortine C which is toxic to dogs)',
      'Cut into pea-sized cubes',
    ],
    servingSize: {
      smallDog: '1 pea-sized cube',
      mediumDog: '2 to 3 small cubes',
      largeDog: 'Small 1-inch slice',
    },
    faq: [
      {
        question: 'Can dogs eat blue cheese or moldy cheese?',
        answer: 'NO. Blue cheeses (Roquefort, Gorgonzola, Stilton) contain roquefortine C, a fungal toxin that causes severe tremors, seizures, and vomiting in dogs.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1200&q=80',
      altText: 'Assorted cheese board',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-mango',
    slug: 'mango',
    name: 'Mango',
    emoji: '🥭',
    category: 'fruits',
    status: 'safe',
    shortVerdict: 'Sweet & Vitamin-Rich (Remove Peel & Pit)',
    quickAnswer: 'Yes! Dogs can safely eat mango flesh. It is packed with vitamins A, B6, C, and E, as well as beta-carotene and potassium.',
    vetReviewSummary: 'Mango is an exceptional sweet treat. Always remove the fibrous peel and large pit, which poses a severe choking and cyanide-precursor hazard.',
    benefits: [
      'Loaded with Vitamin A, C, B6, and E for immune vitality and lustrous coat',
      'Contains beta-carotene and alpha-carotene antioxidants for eye health',
      'High natural dietary fiber aiding regular canine digestion',
    ],
    risks: [
      'Mango pit is a major surgical foreign body choking hazard and contains cyanide',
      'Tough mango skin is difficult for dogs to digest and contains urushiol allergen',
      'High natural sugar requires portion moderation for diabetic or overweight dogs',
    ],
    prepInstructions: [
      'Peel skin completely and discard',
      'Slice flesh away from the large inner hard seed',
      'Cut into bite-sized 1/2-inch cubes',
      'Serve fresh or frozen as a hydrating summer reward',
    ],
    servingSize: {
      smallDog: '1 to 2 small cubes',
      mediumDog: '3 to 4 cubes',
      largeDog: 'A few slices (1/4 cup) max',
    },
    faq: [
      {
        question: 'Can dogs eat dried mango?',
        answer: 'Dried mango is not chemically toxic, but it has highly concentrated sugar and tough fibers that can cause stomach upset. Fresh sliced mango is much safer.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh sliced golden mango',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-pineapple',
    slug: 'pineapple',
    name: 'Pineapple',
    emoji: '🍍',
    category: 'fruits',
    status: 'safe',
    shortVerdict: 'Safe & Enzymatic Superfood (Flesh Only)',
    quickAnswer: 'Yes! Fresh pineapple in small amounts is a fantastic treat rich in vitamin C, thiamin, riboflavin, and bromelain enzyme.',
    vetReviewSummary: 'Pineapple contains bromelain, a natural enzyme that aids protein digestion and helps deter coprophagia (stool eating). Remove the prickly rind and tough core completely.',
    benefits: [
      'Contains bromelain enzyme supporting healthy protein breakdown and joint comfort',
      'High in Vitamin C, thiamin, and minerals copper and potassium',
      'Helps discourage stool-eating behavior naturally in some dogs',
    ],
    risks: [
      'Tough core and spiky skin can lacerate mouths or cause intestinal obstruction',
      'Canned pineapple contains excessive heavy sugary syrup — feed fresh only',
    ],
    prepInstructions: [
      'Slice off all prickly outer skin and eyes',
      'Cut out the fibrous inner wooden core',
      'Cut golden flesh into small cubes',
    ],
    servingSize: {
      smallDog: '1 to 2 small chunks',
      mediumDog: '2 to 3 chunks',
      largeDog: 'Small handful of chunks',
    },
    faq: [
      {
        question: 'Can dogs eat canned pineapple?',
        answer: 'Avoid canned pineapple. It is usually soaked in heavy sugary syrup that can trigger diarrhea, weight gain, and dental cavities in dogs. Always choose fresh.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh sliced pineapple',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-pumpkin',
    slug: 'pumpkin',
    name: 'Canned & Plain Pumpkin',
    emoji: '🎃',
    category: 'vegetables',
    status: 'safe',
    shortVerdict: 'Veterinary #1 Digestive Miracle Food',
    quickAnswer: 'Yes! Plain pureed pumpkin is the gold-standard veterinary home remedy for both canine diarrhea and constipation.',
    vetReviewSummary: 'Pumpkin contains soluble and insoluble fiber that regulates bowel motility and absorbs excess liquid in loose stools. Feed 100% pure pumpkin puree (NEVER pumpkin pie mix).',
    benefits: [
      'Soluble fiber absorbs excess bowel water, quickly soothing diarrhea and firming stool',
      'Insoluble fiber draws moisture into hard stools to relieve constipation',
      'Rich in prebiotics feeding beneficial gut microbiota in the canine colon',
      'Packed with beta-carotene, Vitamin E, iron, and potassium',
    ],
    risks: [
      'NEVER feed pumpkin pie mix (contains toxic nutmeg, allspice, and sugars/xylitol)',
      'Raw pumpkin stem and hard rind are indigestible choking hazards',
    ],
    prepInstructions: [
      'Use 100% pure canned pumpkin puree (single ingredient: pumpkin)',
      'Or bake fresh pumpkin plain and mash until smooth',
      'Stir directly into your dog’s regular meal',
    ],
    servingSize: {
      smallDog: '1 to 2 teaspoons per meal',
      mediumDog: '1 to 2 tablespoons per meal',
      largeDog: '2 to 4 tablespoons per meal',
    },
    faq: [
      {
        question: 'Is pumpkin good for an upset dog stomach?',
        answer: 'Yes! Veterinarians recommend 100% pure pumpkin puree as the first-line gentle dietary aid for resolving mild digestive upset, gas, and irregular stools.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1506917728037-b6af01a7d403?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh whole and sliced orange pumpkins',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-sweet-potatoes',
    slug: 'sweet-potatoes',
    name: 'Cooked Sweet Potatoes',
    emoji: '🍠',
    category: 'vegetables',
    status: 'safe',
    shortVerdict: 'Nutrient-Dense Complex Carbohydrate Superfood',
    quickAnswer: 'Yes! Cooked sweet potatoes are one of the best whole-food dietary fibers and complex carbohydrate sources for canines.',
    vetReviewSummary: 'Cooked sweet potatoes deliver high concentrations of dietary fiber, vitamins A, B6, and C, and essential minerals. Never feed raw sweet potatoes as they are hard to digest.',
    benefits: [
      'Rich in beta-carotene supporting healthy immune defense, eyes, and skin',
      'Low glycemic complex carbohydrate delivering steady, sustained physical energy',
      'High dietary fiber promotes healthy gut bacteria and solid bowel movements',
    ],
    risks: [
      'Never feed raw — raw sweet potatoes are tough, can cause intestinal blockage and indigestion',
      'Do not prepare with butter, brown sugar, marshmallows, or salt',
    ],
    prepInstructions: [
      'Peel skin and steam or bake plain until completely fork-tender',
      'Mash or slice into soft round coins',
      'Allow to cool completely before feeding',
    ],
    servingSize: {
      smallDog: '1 tablespoon mashed',
      mediumDog: '2 to 3 tablespoons mashed',
      largeDog: '1/4 to 1/3 cup mashed',
    },
    faq: [
      {
        question: 'Can dogs eat raw sweet potato?',
        answer: 'No. Raw sweet potatoes are fibrous and difficult for a dog’s gastrointestinal tract to break down, leading to choking or bowel obstruction. Always cook thoroughly.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh organic sweet potatoes',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-salmon',
    slug: 'salmon',
    name: 'Cooked Salmon (Boneless)',
    emoji: '🐟',
    category: 'meats_proteins',
    status: 'safe',
    shortVerdict: 'Omega-3 Fatty Acid Coat & Joint Champion',
    quickAnswer: 'Yes! Plain cooked boneless salmon is an incredible source of Omega-3 EPA/DHA fatty acids for canine skin, coat, and joints.',
    vetReviewSummary: 'Cooked salmon is among the healthiest fish for dogs. NEVER feed raw salmon from the Pacific Northwest due to lethal Salmon Poisoning Disease (Nanophyetus salmincola).',
    benefits: [
      'Exceptional levels of Omega-3 EPA/DHA fatty acids reduce joint inflammation',
      'Promotes an intensely glossy, dandruff-free coat and soothes dry, itchy skin',
      'High quality, easily digestible marine protein for muscle recovery',
    ],
    risks: [
      'NEVER FEED RAW SALMON — can carry Neorickettsia helminthoeca parasite (fatal Salmon Poisoning Disease)',
      'Cooked fish bones can lodge in throat or tear stomach lining — remove all pin bones',
    ],
    prepInstructions: [
      'Bake, steam, or poach plain until fully cooked through (145°F / 63°C internal)',
      'Thoroughly check and remove 100% of pin bones and skin scales',
      'Flake into regular kibble as a nutrient-dense topper',
    ],
    servingSize: {
      smallDog: '1 tablespoon flaked',
      mediumDog: '2 tablespoons flaked',
      largeDog: '1/4 cup flaked 1-2 times per week',
    },
    faq: [
      {
        question: 'What is Salmon Poisoning Disease in dogs?',
        answer: 'Raw fish from the Pacific Northwest can contain a fluke infected with bacteria that causes Salmon Poisoning Disease. It is life-threatening if untreated. Always cook salmon thoroughly.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d0?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh cooked salmon fillet',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-popcorn',
    slug: 'popcorn',
    name: 'Plain Air-Popped Popcorn',
    emoji: '🍿',
    category: 'human_foods',
    status: 'moderate',
    shortVerdict: 'Safe ONLY if Plain, Air-Popped (No Butter/Salt)',
    quickAnswer: 'Yes, in moderation, ONLY if it is plain and air-popped with zero butter, oil, or salt. Unpopped kernels are a hazard.',
    vetReviewSummary: 'Plain air-popped corn contains fiber, zinc, and magnesium. Movie theater or microwave buttered popcorn causes severe digestive upset and pancreatitis due to high fats and sodium.',
    benefits: [
      'Light, crunchy low-calorie reward for trick training',
      'Contains small amounts of iron, magnesium, and B vitamins',
    ],
    risks: [
      'Hard unpopped kernels can crack canine teeth or become stuck between gums',
      'Butter, oil, and salt cause dehydration, vomiting, and pancreatitis',
    ],
    prepInstructions: [
      'Air-pop plain kernels in a hot air popper without oil',
      'Pick out and discard all unpopped hard kernels',
      'Feed individual popped flakes as catch rewards',
    ],
    servingSize: {
      smallDog: 'Small pinch (3 to 5 popped kernels)',
      mediumDog: 'Small handful',
      largeDog: '1 cup popped maximum',
    },
    faq: [
      {
        question: 'Can dogs eat microwave buttered popcorn?',
        answer: 'No. Microwave popcorn contains hydrogenated oils, artificial butter flavorings (diacetyl), and high sodium, which can trigger severe vomiting and pancreatitis.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=1200&q=80',
      altText: 'Plain popped popcorn bowl',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-bread',
    slug: 'bread',
    name: 'Plain Cooked Bread',
    emoji: '🍞',
    category: 'dairy_grains',
    status: 'moderate',
    shortVerdict: 'Safe in Small Amounts (NEVER Raw Yeast Dough)',
    quickAnswer: 'Yes, plain baked white or wheat bread is safe as an occasional treat, but offers minimal nutritional value. Raw yeast dough is DEADLY.',
    vetReviewSummary: 'Plain baked bread is harmless in small bites. However, unbaked yeast dough expands in a dog’s warm stomach and produces toxic ethanol, creating a surgical emergency.',
    benefits: [
      'Helpful for padding stomach after swallowing small sharp objects (under vet instruction)',
      'Inoffensive vehicle for administering oral medications',
    ],
    risks: [
      'RAW YEAST DOUGH IS FATAL — expands causing gastric dilation and produces lethal alcohol poisoning',
      'High in simple carbohydrates and empty calories contributing to weight gain',
      'Check for raisins, garlic, onion, or xylitol in specialty breads',
    ],
    prepInstructions: [
      'Feed only fully baked, plain, unseasoned bread',
      'Tear into bite-sized morsels',
      'Never feed moldy bread (mycotoxins cause severe tremors)',
    ],
    servingSize: {
      smallDog: '1 small crust piece',
      mediumDog: 'Half a slice',
      largeDog: '1 full slice maximum occasional',
    },
    faq: [
      {
        question: 'Why is raw bread dough dangerous to dogs?',
        answer: 'Yeast multiplies in the warm stomach environment, producing carbon dioxide gas that causes life-threatening stomach bloat (GDV) and ethanol alcohol that causes acute alcohol poisoning.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh sliced rustic baked bread',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-honey',
    slug: 'honey',
    name: 'Pure Raw Honey',
    emoji: '🍯',
    category: 'human_foods',
    status: 'moderate',
    shortVerdict: 'Safe in Minute Dabs (Antimicrobial & Allergy Aid)',
    quickAnswer: 'Yes, in small dabs. Honey contains natural antioxidants, pollen enzymes, and antimicrobial properties.',
    vetReviewSummary: 'Local raw honey can help build environmental pollen immunity and soothe kennel cough throats. Never feed honey to puppies under 1 year due to botulism spore risks.',
    benefits: [
      'Local wildflower honey contains micro-pollens that can soothe seasonal canine allergies',
      'Natural soothing demulcent coat for irritated kennel cough throats',
      'Contains flavonoids, phenolic acids, and natural antibacterial enzymes',
    ],
    risks: [
      'NEVER feed to puppies under 12 months (risk of botulism spores)',
      'Extremely high sugar content can cause dental cavities and weight gain',
      'Unsuitable for diabetic canines',
    ],
    prepInstructions: [
      'Use 100% pure raw unfiltered honey',
      'Dab onto a teaspoon for the dog to lick directly',
      'Or dissolve in lukewarm water as a soothing throat rinse',
    ],
    servingSize: {
      smallDog: '1/4 teaspoon occasionally',
      mediumDog: '1/2 teaspoon occasionally',
      largeDog: '1 teaspoon occasionally',
    },
    faq: [
      {
        question: 'Can puppies eat honey?',
        answer: 'No. Puppies under one year old do not have fully developed immune systems to neutralize Clostridium botulinum spores that can naturally exist in raw honey.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
      altText: 'Pure golden honey jar',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-macadamia-nuts',
    slug: 'macadamia-nuts',
    name: 'Macadamia Nuts',
    emoji: '🌰',
    category: 'human_foods',
    status: 'toxic',
    shortVerdict: 'STRICTLY TOXIC — Severe Neurological & Muscular Weakness',
    quickAnswer: 'NO! Macadamia nuts are HIGHLY TOXIC to all dogs. Ingestion causes hind limb paralysis, muscle tremors, and high fever.',
    vetReviewSummary: 'Even minute quantities of macadamias cause acute neurotoxicity in dogs. Symptoms appear within 12 hours and include weakness, inability to walk, vomiting, and hyperthermia.',
    benefits: ['NONE — Toxic to dogs.'],
    risks: [
      'Hind limb weakness, ataxia, and inability to stand or walk',
      'Severe muscle tremors, stiffness, and joint swelling',
      'Hyperthermia (dangerously high body temperature) and acute pancreatitis',
    ],
    prepInstructions: [
      'NEVER FEED. Keep all cookies, nut mixes, and trail mixes locked away.',
    ],
    servingSize: {
      smallDog: 'ZERO (Toxic)',
      mediumDog: 'ZERO (Toxic)',
      largeDog: 'ZERO (Toxic)',
    },
    symptomsIfIngested: [
      'Weakness in back legs / stumbling within 6 to 12 hours',
      'Inability to walk or bear weight on hind legs',
      'Vomiting, fever, and muscle tremors',
    ],
    faq: [
      {
        question: 'How many macadamia nuts can harm a dog?',
        answer: 'As little as 1 to 2 nuts per 10 pounds of body weight can cause severe toxic symptoms. Contact an emergency veterinarian immediately if ingested.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1536591375315-1b8380b2a59a?auto=format&fit=crop&w=1200&q=80',
      altText: 'Toxic macadamia nuts warning',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-coffee-caffeine',
    slug: 'coffee-and-caffeine',
    name: 'Coffee, Tea & Caffeine',
    emoji: '☕',
    category: 'human_foods',
    status: 'toxic',
    shortVerdict: 'STRICTLY TOXIC — Central Nervous & Heart Hazard',
    quickAnswer: 'NO! Caffeine is a potent methylxanthine stimulant that is toxic to dogs, causing severe cardiac arrhythmias and seizures.',
    vetReviewSummary: 'Canine cardiovascular systems are hypersensitive to caffeine. Ingestion of coffee grounds, tea bags, energy drinks, or soda requires emergency veterinary intervention.',
    benefits: ['NONE — Poisonous stimulant to dogs.'],
    risks: [
      'Tachycardia (dangerously elevated heart rate) and fatal arrhythmias',
      'Neurological hyperactivity, severe muscle tremors, and seizures',
      'High blood pressure, hyperthermia, and cardiovascular collapse',
    ],
    prepInstructions: [
      'NEVER FEED. Discard coffee grounds, K-cups, and tea bags in closed bins.',
    ],
    servingSize: {
      smallDog: 'ZERO (Toxic)',
      mediumDog: 'ZERO (Toxic)',
      largeDog: 'ZERO (Toxic)',
    },
    symptomsIfIngested: [
      'Extreme restlessness, panting, and pacing within 30 minutes',
      'Rapid heart rate, muscle twitching, vomiting',
      'Seizures, collapse, and cardiac arrest',
    ],
    faq: [
      {
        question: 'What if my dog licked a few drops of coffee?',
        answer: 'A small lick of milky coffee is unlikely to be fatal for a medium/large dog, but coffee grounds or caffeine pills are highly concentrated and require immediate veterinary attention.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
      altText: 'Coffee beans and hot coffee warning for dogs',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-white-rice',
    slug: 'white-rice',
    name: 'Cooked White Rice',
    emoji: '🍚',
    category: 'dairy_grains',
    status: 'safe',
    shortVerdict: 'Gentle Bland Diet Digestive Staple',
    quickAnswer: 'Yes! Plain boiled white rice is the standard veterinarian-recommended carbohydrate for dogs recovering from gastrointestinal upset.',
    vetReviewSummary: 'White rice has a high starch content that is easily broken down, binding loose stools without taxing an inflamed digestive system.',
    benefits: [
      'Gentlest carbohydrate for calming gastritis and settling acute diarrhea',
      'Easily digestible source of quick energy for convalescing dogs',
      'Pairs perfectly with plain boiled chicken for a 3-day recovery diet',
    ],
    risks: [
      'Do not cook with salt, butter, oils, or bouillon seasonings',
      'High glycemic index — feed in moderation for diabetic dogs',
    ],
    prepInstructions: [
      'Boil in plain water without any added salt, butter, or spices',
      'Ensure rice is thoroughly cooked until soft',
      'Mix 2 parts white rice with 1 part plain boiled shredded chicken breast',
    ],
    servingSize: {
      smallDog: '1 to 2 tablespoons',
      mediumDog: '1/4 to 1/2 cup',
      largeDog: '1 cup mixed with protein',
    },
    faq: [
      {
        question: 'Why is white rice better than brown rice for diarrhea?',
        answer: 'Brown rice contains tough outer fibrous husk that requires more digestive effort. White rice is easily absorbed and immediately calms an inflamed canine bowel.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=80',
      altText: 'Cooked plain white rice bowl',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-shrimp',
    slug: 'shrimp',
    name: 'Cooked Shrimp (Peeled & Deveined)',
    emoji: '🦐',
    category: 'meats_proteins',
    status: 'safe',
    shortVerdict: 'Safe & Low-Calorie Seafood Protein (Fully Cooked)',
    quickAnswer: 'Yes! Plain cooked, peeled, and deveined shrimp is a safe, high-protein treat rich in B vitamins, phosphorus, and antioxidants.',
    vetReviewSummary: 'Shrimp is a fantastic low-fat, nutrient-dense reward. Always cook thoroughly and remove 100% of the hard shell, tail, and head to prevent choking.',
    benefits: [
      'Packed with antioxidant astaxanthin and Vitamin B12 for metabolic health',
      'Contains phosphorus supporting strong bones and healthy teeth',
      'Extremely lean protein with virtually zero carbohydrates',
    ],
    risks: [
      'NEVER feed raw shrimp (contains harmful bacteria like Vibrio and parasites)',
      'Shells and tails can puncture the mouth and esophagus or cause bowel blockage',
      'Fried or battered shrimp (tempura, coconut shrimp) is high in toxic fats and oils',
    ],
    prepInstructions: [
      'Remove shell, tail, head, and black intestinal vein completely',
      'Steam, boil, or grill plain with zero seasoning, butter, or garlic',
      'Chop into bite-sized pieces before serving',
    ],
    servingSize: {
      smallDog: 'Half to 1 small shrimp',
      mediumDog: '1 to 2 shrimp',
      largeDog: '2 to 3 shrimp',
    },
    faq: [
      {
        question: 'Can dogs eat shrimp tails or shells?',
        answer: 'No. Shrimp shells and tails are made of chitin which is brittle and sharp, posing a severe choking hazard and intestinal puncture risk.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh cooked pink shrimp',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-mushrooms',
    slug: 'mushrooms',
    name: 'Mushrooms (Store-Bought vs Wild)',
    emoji: '🍄',
    category: 'vegetables',
    status: 'moderate',
    shortVerdict: 'Store White/Cremini Safe — WILD MUSHROOMS ARE LETHAL',
    quickAnswer: 'Caution. Plain, cooked grocery store mushrooms (white button, portobello) are safe, but WILD outdoor mushrooms can cause rapid fatal toxicity.',
    vetReviewSummary: 'While plain store-bought culinary mushrooms are safe in small bites, dogs cannot distinguish safe mushrooms from lethal wild species (Amanita phalloides). Extreme caution advised outdoors.',
    benefits: [
      'Store-bought cooked mushrooms provide B vitamins, selenium, and copper',
    ],
    risks: [
      'WILD MUSHROOMS ARE EXTREMELY TOXIC — causes acute liver and kidney failure within hours',
      'Store mushrooms cooked in butter, garlic, or wine are toxic',
    ],
    prepInstructions: [
      'Only feed certified culinary grocery store mushrooms (Button, Cremini, Portobello)',
      'Wash and cook thoroughly plain without butter, garlic, or salt',
      'Rake yard regularly to remove all wild yard mushrooms immediately',
    ],
    servingSize: {
      smallDog: '1 small cooked slice',
      mediumDog: '2 cooked slices',
      largeDog: 'Small spoonful cooked plain',
    },
    symptomsIfIngested: [
      'If wild mushroom eaten: Salivation, severe vomiting, jaundice, seizures, coma. Immediate ER rush.',
    ],
    faq: [
      {
        question: 'What if my dog eats a wild mushroom in the backyard?',
        answer: 'Treat it as a medical emergency. Pluck a sample of the mushroom in a paper towel for veterinary identification and rush your dog to the nearest emergency clinic immediately.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh culinary mushrooms',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-almonds',
    slug: 'almonds',
    name: 'Almonds',
    emoji: '🌰',
    category: 'human_foods',
    status: 'moderate',
    shortVerdict: 'Not Toxic But Not Recommended (Choking & Pancreatitis)',
    quickAnswer: 'Almonds are not chemically toxic like macadamias, but dogs do not digest nuts well. They present a major choking and pancreatitis hazard.',
    vetReviewSummary: 'Canine digestive systems are not equipped to break down dense nut fats. Whole almonds often pass undigested, risking esophageal obstruction and gastric distress.',
    benefits: [
      'Contains Vitamin E and magnesium (but poorly absorbed by canines)',
    ],
    risks: [
      'Rigid oval shape easily blocks windpipes and intestines in small breeds',
      'High dense fat content can trigger painful acute pancreatitis',
      'Salted, smoked, or seasoned almonds cause sodium ion toxicity',
    ],
    prepInstructions: [
      'Best to avoid entirely. If an almond is dropped, monitor for choking.',
    ],
    servingSize: {
      smallDog: 'ZERO (Not recommended)',
      mediumDog: '1 accidental almond is safe',
      largeDog: '1 to 2 occasional max',
    },
    faq: [
      {
        question: 'Can dogs drink almond milk?',
        answer: 'A small sip of plain unsweetened almond milk is not toxic, but offers no real nutritional value to dogs. Avoid flavored or xylitol-sweetened varieties.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1508061252966-f72fb98abc22?auto=format&fit=crop&w=1200&q=80',
      altText: 'Raw whole almonds in wooden bowl',
      credit: 'Unsplash Food Archive',
    },
  },
  {
    id: 'food-mango',
    slug: 'mango',
    name: 'Mango',
    emoji: '🥭',
    category: 'fruits',
    status: 'safe',
    shortVerdict: 'Safe & Sweet (Remove Peel & Hard Pit)',
    quickAnswer: 'Yes! Dogs can safely enjoy fresh mango flesh as a nutrient-packed tropical treat. Always peel the tough skin and discard the large choking pit.',
    vetReviewSummary: 'Mangoes are rich in vitamins A, B6, C, and E, plus beta-carotene and dietary fiber. Because of their natural sugar content, feed mango in moderation as an occasional treat.',
    benefits: [
      'High in Vitamin A and Beta-Carotene supporting eyesight and immune defense',
      'Packed with Vitamin C and potassium for cellular vitality',
      'Rich in soluble fiber that aids gentle canine digestion',
      'Naturally sweet flavor loved by picky dogs',
    ],
    risks: [
      'The large central pit contains trace cyanide and poses a life-threatening intestinal obstruction hazard',
      'Mango peel is tough, fibrous, and can cause gastric irritation or vomiting',
      'High natural fructose can cause diarrhea if fed in excessive amounts',
    ],
    prepInstructions: [
      'Wash thoroughly under cold water',
      'Peel away all outer skin completely',
      'Slice the juicy golden flesh away from the large woody central pit',
      'Cut flesh into small bite-sized cubes or freeze for a refreshing summer snack',
    ],
    servingSize: {
      smallDog: '1 to 2 small cubes per day',
      mediumDog: '3 to 4 cubes per day',
      largeDog: 'Quarter of a mango sliced',
    },
    faq: [
      {
        question: 'Can dogs eat dried mango?',
        answer: 'Dried mango is not toxic, but it has much higher concentrated sugar and calories than fresh mango. Fresh sliced mango is much healthier for your dog.',
      },
      {
        question: 'What should I do if my dog swallowed a whole mango pit?',
        answer: 'A mango pit cannot pass through most canine digestive tracts and will cause a severe intestinal blockage. Call your emergency veterinarian immediately for guidance or endoscopic removal.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh sliced ripe mango on plate',
      credit: 'Unsplash Food Photography',
    },
  },
  {
    id: 'food-dragon-fruit',
    slug: 'dragon-fruit',
    name: 'Dragon Fruit',
    emoji: '🐉',
    category: 'fruits',
    status: 'safe',
    shortVerdict: '100% Safe & Antioxidant-Rich (Peel Leathery Skin)',
    quickAnswer: 'Yes! Both white and red/purple dragon fruit (pitaya) are completely non-toxic and safe for dogs to eat in moderation. Just remove the leathery spiky outer skin.',
    vetReviewSummary: 'Dragon fruit is rich in calcium, iron, prebiotic fiber, and antioxidants with tiny edible seeds that pass easily through the canine gastrointestinal tract.',
    benefits: [
      'Packed with powerful polyphenols and antioxidants fighting oxidative stress',
      'High moisture content (over 80% water) helping maintain canine hydration',
      'Loaded with prebiotic fiber promoting beneficial gut microflora',
      'Contains essential fatty acids in tiny edible black seeds',
    ],
    risks: [
      'Tough, leathery outer skin is hard to digest and should always be removed',
      'Red/pink dragon fruit flesh can temporarily turn dog urine or stool red (completely harmless but alarming to owners)',
      'Too much dragon fruit at once can cause loose stools due to high fiber content',
    ],
    prepInstructions: [
      'Slice dragon fruit in half lengthwise',
      'Scoop out the soft inner flesh with a spoon, leaving the pink skin behind',
      'Chop into bite-sized pieces or puree over regular meals',
    ],
    servingSize: {
      smallDog: '1 tablespoon of flesh',
      mediumDog: '2 tablespoons of flesh',
      largeDog: '3 to 4 tablespoons of flesh',
    },
    faq: [
      {
        question: 'Can dogs eat red dragon fruit vs white dragon fruit?',
        answer: 'Both varieties are equally safe and nutritious for dogs. Red pitaya contains slightly higher antioxidant levels (betalains), while white pitaya has a milder flavor.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1527325678964-54921641b888?auto=format&fit=crop&w=1200&q=80',
      altText: 'Fresh vibrant sliced dragon fruit pitaya',
      credit: 'Unsplash Food Photography',
    },
  },
  {
    id: 'food-pistachios',
    slug: 'pistachios',
    name: 'Pistachios',
    emoji: '🥜',
    category: 'human_foods',
    status: 'toxic',
    shortVerdict: 'NOT Recommended / Toxic Risk (Aflatoxin & Pancreatitis Hazard)',
    quickAnswer: 'No. While one dropped pistachio won\'t be instantly fatal, pistachios are unsafe for dogs due to aflatoxin mold contamination risks, high fat content (pancreatitis), and sharp choking shells.',
    vetReviewSummary: 'Pistachios carry a high susceptibility to Aspergillus mold which produces aflatoxins (deadly liver toxins in canines). Furthermore, the sharp rigid shells cause severe esophageal and gastrointestinal punctures or blockages.',
    benefits: [
      'No unique canine benefits that cannot be provided by safer veterinary foods',
    ],
    risks: [
      'Aflatoxin mold poisoning can cause acute canine liver failure and death',
      'Extremely high fat content triggers sudden, life-threatening acute pancreatitis',
      'Sharp, hard shells cause choking, perforated intestines, or bowel obstruction',
      'Commercial pistachios are heavily salted, leading to sodium ion toxicosis',
    ],
    prepInstructions: [
      'DO NOT FEED. Keep pistachio bags and snack bowls securely away from pets.',
    ],
    servingSize: {
      smallDog: 'ZERO (Strictly Avoid)',
      mediumDog: 'ZERO (Strictly Avoid)',
      largeDog: 'ZERO (Strictly Avoid)',
    },
    faq: [
      {
        question: 'What if my dog accidentally ate one shelled pistachio?',
        answer: 'A single unsalted pistachio is unlikely to cause poisoning. Monitor your dog for 24-48 hours for signs of vomiting, diarrhea, lethargy, or abdominal tenderness. If a whole handful or shell was eaten, call your vet.',
      },
      {
        question: 'What are the symptoms of pistachio poisoning in dogs?',
        answer: 'Symptoms include violent vomiting, dark/bloody diarrhea, severe abdominal pain (praying posture), jaundice (yellow gums/eyes from liver distress), and lethargy.',
      },
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=1200&q=80',
      altText: 'Raw pistachios in shells on table',
      credit: 'Unsplash Food Photography',
    },
  },
];

