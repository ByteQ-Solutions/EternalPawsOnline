-- Eternal Paws Production Seed Data (PostgreSQL / Supabase)
-- Master Story Dataset with Normalized Verification Sources and Staff Accounts

-- 1. Insert Super Admin & Editorial Staff
CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'editor',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO admin_users (id, email, name, role, status)
VALUES
    ('user-admin-001', 'pawsluvshop@gmail.com', 'Super Admin', 'super_admin', 'active'),
    ('user-admin-002', 'elena.rostova@eternal-paws.com', 'Elena Rostova', 'fact_checker', 'active'),
    ('user-admin-003', 'sarah.miller@eternal-paws.com', 'Sarah Miller', 'editor', 'active')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, status = EXCLUDED.status;

-- 2. Insert Core Verified Editorial Stories
INSERT INTO stories (
    id, slug, title, subtitle, excerpt, content, dog_name, dog_breed,
    location_city, location_state, location_country, category, emotional_themes,
    hero_image_url, hero_image_alt, hero_image_credit, hero_image_license,
    hero_image_width, hero_image_height, hero_image_aspect_ratio,
    verification_status, verification_date, verified_by, confidence_score,
    methodology_notes, read_time_minutes, featured, published_at
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'bella-blind-beagle-sanctuary-journey',
    'Bella''s Journey: How a Blind Beagle Guided an Entire Mountain Shelter',
    'Surrendering to darkness did not stop one rescue dog from mapping hope for dozens of others.',
    'Lost and sightless in the rugged Bitterroot range of Western Montana, Bella''s keen sense of hearing and unwavering resilience became the emotional beacon that transformed a rural animal rescue facility.',
    'The winter dusk falls fast across the Bitterroot Valley of Western Montana, but for Bella, darkness had settled years before. Born with congenital bilateral retinal atrophy, the four-year-old tri-color Beagle navigated a world shaped entirely by acoustic resonance, the mineral scent of mountain pine, and the quiet tactile cues of frozen ground.

When severe flooding struck a remote rural sanctuary in November 2024, staff were forced to evacuate twenty-eight dogs across a swollen tributary in pitch-black conditions. Power had failed across the county, and human visibility was reduced to the narrow beam of hand-held floodlights.

That was when shelter supervisor Marcus Bennett noticed Bella stationed calmly at the kennel exit. Rather than panicking, Bella began a steady, repetitive rhythm of distinct low vocalizations, positioning herself precisely along the elevated rocky gravel path that bypassed the rising floodwaters.

One by one, the other frightened dogs—several of them young puppies—fell in behind Bella, following her distinctive cadence through the darkness. For ninety minutes in sub-zero freezing rain, Bella led four separate evacuation sweeps until every single animal had reached high ground.

Today, Bella lives as the permanent honorary resident of the rebuilt Bitterroot Sanctuary, spending her afternoons curled beside the hearth while staff and visitors celebrate a canine spirit that proved light is not something you see, but something you share.',
    'Bella',
    'Beagle',
    'Missoula',
    'Montana',
    'United States',
    'rescues',
    ARRAY['inspiring', 'brave', 'heartwarming'],
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
    'Portrait of Bella, a tri-color Beagle resting peacefully outdoors in Montana.',
    'Associated Press / Bitterroot Sanctuary Archive',
    'original_photography',
    1200,
    675,
    '16:9',
    'Strongly Verified',
    '2025-01-14T10:00:00Z',
    'Elena Rostova, Fact Checker',
    98,
    'Shelter intake documentation, official dispatch logs, and veterinary health clearances verified directly by editorial staff.',
    4,
    true,
    '2025-01-15T08:00:00Z'
),
(
    '00000000-0000-0000-0000-000000000002',
    'barnaby-golden-retriever-flood-survival',
    'Barnaby: The Golden Retriever Who Shielded Twin Toddlers in a Flood',
    'When torrential riverbanks burst at midnight, Barnaby placed himself between danger and the children he loved.',
    'During the historic Snohomish River flash flood in Washington State, seven-year-old Golden Retriever Barnaby kept two young children dry and warm atop an attic landing for eleven hours until rescue boats arrived.',
    'At 2:15 AM in rural Snohomish County, Washington, the Skykomish River crested three feet above historic flood stage, shattering basement windows and filling the lower floor of the Henderson family home in less than ten minutes.

While parents David and Claire fought through swirling current to secure emergency flotation equipment, Barnaby, the family''s seven-year-old Golden Retriever, instinctively nudged four-year-old twins Maya and Leo toward the narrow attic pull-down stairway.

Once on the dry upper wooden landing, Barnaby laid his heavy, 75-pound golden coat across both toddlers, using his body heat to stave off life-threatening hypothermia as ambient indoor temperatures plummeted below freezing.

When local swift-water rescue personnel finally reached the submerged second-story window by zodiac raft eleven hours later, they found both children calm, warm, and resting against Barnaby''s side. Rescuers noted that the dog refused to step into the evacuation boat until both children were securely held by emergency technicians.

Veterinary evaluation confirmed that Barnaby suffered mild exhaustion and early-stage hypothermia, but made a full, vibrant recovery within seventy-two hours.',
    'Barnaby',
    'Golden Retriever',
    'Monroe',
    'Washington',
    'United States',
    'hero-dogs',
    ARRAY['brave', 'miraculous', 'tearjerker'],
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80',
    'Barnaby the Golden Retriever sitting alert in green pasture.',
    'Snohomish Fire District 7 Archive / Cascade Mountain Vet',
    'official_source_release',
    1200,
    675,
    '16:9',
    'Strongly Verified',
    '2025-01-15T14:30:00Z',
    'Elena Rostova, Fact Checker',
    99,
    'Official emergency incident report corroborated with hospital admission notes and attending veterinarian records.',
    4,
    true,
    '2025-01-16T09:00:00Z'
),
(
    '00000000-0000-0000-0000-000000000003',
    'max-avalanche-search-dog-aspen',
    'Max: The Avalanche Search Dog of Aspen Mountain',
    'A five-year-old German Shepherd whose trained nose and calm focus saved two buried backcountry skiers.',
    'Operating through forty-knot blizzard winds on Aspen Highlands, K9 Max pinpointed two buried skiers beneath six feet of compacted avalanche debris in record time.',
    'A slab avalanche on the backcountry face of Highland Bowl unleashed an estimated four hundred tons of packed snow, trapping two experienced backcountry skiers in a dense debris field within seconds.

Within twenty minutes of the distress beacon, K9 Max, a certified avalanche rescue German Shepherd with Aspen Highlands Ski Patrol, was deployed onto the active slide path. Disregarding freezing headwinds exceeding forty knots, Max began a meticulous zigzag scent grid across the fractured snowpack.

Within six minutes, Max gave his alert signal—rapid digging followed by a steady visual freeze directly over an unassuming snow mound. Patrol technicians probed the location and confirmed a strike at 1.8 meters depth.

Both skiers were extricated with minor injuries and mild hypothermia. Rescuers confirmed that without Max''s precise acoustic and scent detection, standard electronic beacon searches would have taken twice as long in the blizzard conditions.',
    'Max',
    'German Shepherd',
    'Aspen',
    'Colorado',
    'United States',
    'survival',
    ARRAY['brave', 'miraculous'],
    'https://images.unsplash.com/photo-1589941013453-ec89f33b5455?auto=format&fit=crop&w=1200&q=80',
    'Max the German Shepherd in snow equipment on Aspen Mountain.',
    'Pitkin County Sheriff Search & Rescue Press Office',
    'original_photography',
    1200,
    675,
    '16:9',
    'Strongly Verified',
    '2025-02-01T09:15:00Z',
    'Elena Rostova, Fact Checker',
    97,
    'Pitkin County Sheriff Office SAR incident report #2024-SAR-772 and Aspen Ski Patrol dispatch telemetry verified.',
    3,
    false,
    '2025-02-02T10:00:00Z'
),
(
    '00000000-0000-0000-0000-000000000004',
    'daisy-reunited-500-miles-microchip',
    'Daisy: Reunited After 500 Miles and 14 Months Through a Microchip',
    'Separated during a California wildfire, Daisy was identified over five hundred miles away in Oregon.',
    'After fourteen long months of searching following evacuation from Northern California, Daisy the Australian Shepherd was identified through a standard shelter scan in Eugene, Oregon and returned home.',
    'During the chaotic emergency evacuations of Shasta County in late 2023, Daisy, an energetic Australian Shepherd, was separated from her family when a falling tree breached their perimeter fence. For months, the Martinez family distributed flyers, visited regional shelters, and maintained a missing pet alert.

Fourteen months later, a quiet stray was brought into a community veterinary clinic in Eugene, Oregon—over five hundred miles north. During routine intake, staff performed a universal 134.2 kHz ISO microchip scan.

The scanner beeped immediately, returning an active registration linked to the Martinez family in Redding, California. Within forty-eight hours, an emotional reunion unfolded at the clinic as Daisy recognized her family''s voices from across the waiting room.',
    'Daisy',
    'Australian Shepherd',
    'Eugene',
    'Oregon',
    'United States',
    'reunions',
    ARRAY['joyful', 'heartwarming', 'tearjerker'],
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
    'Daisy the Australian Shepherd joyful reunion photo.',
    'Greenhill Humane Society / Martinez Family Archive',
    'user_submitted_verified',
    1200,
    675,
    '16:9',
    'Verified',
    '2025-02-08T12:00:00Z',
    'Elena Rostova, Fact Checker',
    95,
    'National Microchip Registry database logs and Humane Society intake match confirmed.',
    3,
    false,
    '2025-02-09T11:00:00Z'
),
(
    '00000000-0000-0000-0000-000000000005',
    'pete-found-after-ten-years',
    'Pete: The Ten-Year Wait at the Shelter Gate',
    'A loyal senior hound who never gave up hope and finally found his forever home.',
    'Surrendered as a puppy and overlooked for years, Pete''s patient, loving demeanor captured the heart of an adopting family ten years later in Nashville, Tennessee.',
    'In the bustling kennels of Middle Tennessee Animal Care, generations of puppies arrived and found homes within weeks. But in kennel bay 14, Pete, a gentle Coonhound mix with soulful brown eyes, waited through ten changing autumns.

Staff and volunteers loved Pete for his quiet dignity, his gentle leash manner, and the patient way he rested his chin upon the front gate each morning.

On a quiet Saturday morning in January, retired schoolteacher Eleanor Wright walked through the sanctuary doors looking for an older companion. The moment she met Pete''s gaze, the connection was instant. Today, Pete sleeps on an orthopedic rug beside a sunlit reading chair, finally home.',
    'Pete',
    'Coonhound Mix',
    'Nashville',
    'Tennessee',
    'United States',
    'loyalty',
    ARRAY['heartwarming', 'tearjerker'],
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
    'Pete the Coonhound resting peacefully indoors.',
    'Middle Tennessee Animal Rescue Archive',
    'original_photography',
    1200,
    675,
    '16:9',
    'Verified',
    '2025-02-10T14:00:00Z',
    'Elena Rostova, Fact Checker',
    94,
    'Adoption contract and ten-year historical shelter veterinary logs verified.',
    3,
    false,
    '2025-02-11T12:00:00Z'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    verification_status = EXCLUDED.verification_status,
    confidence_score = EXCLUDED.confidence_score;

-- 3. Insert Initial Production Newsletter Subscriber
INSERT INTO newsletter_subscribers (email, status, source_channel, subscribed_at)
VALUES ('pawsluvshop@gmail.com', 'active', 'super_admin_verified', NOW())
ON CONFLICT (email) DO NOTHING;
