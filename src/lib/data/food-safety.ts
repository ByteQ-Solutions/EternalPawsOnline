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
];
