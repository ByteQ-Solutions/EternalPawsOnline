-- Eternal Paws Database Schema (PostgreSQL / Supabase Migration)
-- Schema Version: 1.0.0
-- Requirements: ORIGINAL_REQUEST § R3, R4, R5, R6; PROJECT.md F06, F07, F21, F22, F24, F25

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Story Categories Enum
CREATE TYPE story_category AS ENUM (
    'reunions',
    'hero-dogs',
    'rescues',
    'survival',
    'loyalty',
    'lost-and-found'
);

-- 2. Verification Status Enum
CREATE TYPE verification_status AS ENUM (
    'Unverified',
    'Partially Verified',
    'Verified',
    'Strongly Verified'
);

-- 3. Image License Type Enum
CREATE TYPE image_license_type AS ENUM (
    'original_photography',
    'official_source_release',
    'user_submitted_verified',
    'ai_visual_reconstruction'
);

-- 4. Stories Table
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    dog_name VARCHAR(100) NOT NULL,
    dog_breed VARCHAR(100) NOT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_state VARCHAR(100) NOT NULL,
    location_country VARCHAR(100) NOT NULL DEFAULT 'United States',
    category story_category NOT NULL,
    emotional_themes TEXT[] NOT NULL DEFAULT '{}',
    hero_image_url TEXT NOT NULL,
    hero_image_alt TEXT NOT NULL,
    hero_image_credit TEXT NOT NULL,
    hero_image_license image_license_type NOT NULL,
    hero_image_width INT NOT NULL DEFAULT 1200,
    hero_image_height INT NOT NULL DEFAULT 675,
    hero_image_aspect_ratio VARCHAR(20) NOT NULL DEFAULT '16:9',
    hero_image_ai_disclosure TEXT,
    verification_status verification_status NOT NULL DEFAULT 'Unverified',
    verification_date TIMESTAMPTZ,
    verified_by VARCHAR(255),
    confidence_score INT NOT NULL DEFAULT 0 CHECK (confidence_score BETWEEN 0 AND 100),
    methodology_notes TEXT,
    read_time_minutes INT NOT NULL DEFAULT 3,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Verification Sources Table
CREATE TABLE IF NOT EXISTS verification_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(100) NOT NULL,
    document_reference VARCHAR(255),
    source_url TEXT,
    verified_by VARCHAR(255) NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reliability_tier VARCHAR(50) NOT NULL DEFAULT 'Tier 1 Official Record',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, unsubscribed, bounced
    source_channel VARCHAR(100) NOT NULL DEFAULT 'web_footer',
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
);

-- 7. Community Story Submissions Table
CREATE TABLE IF NOT EXISTS story_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_code VARCHAR(50) UNIQUE NOT NULL,
    submitter_name VARCHAR(255) NOT NULL,
    submitter_email VARCHAR(255) NOT NULL,
    submitter_phone VARCHAR(50),
    dog_name VARCHAR(100) NOT NULL,
    dog_breed VARCHAR(100),
    location_city VARCHAR(100) NOT NULL,
    location_state VARCHAR(100),
    event_year VARCHAR(10),
    category story_category NOT NULL,
    emotional_themes TEXT[] NOT NULL DEFAULT '{}',
    story_title VARCHAR(255) NOT NULL,
    story_narrative TEXT NOT NULL,
    photo_name VARCHAR(255),
    photo_credit VARCHAR(255),
    license_type image_license_type NOT NULL DEFAULT 'user_submitted_verified',
    source_name VARCHAR(255),
    source_url TEXT,
    rights_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_review', -- pending_review, in_fact_check, approved, rejected
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Reader Correction Tickets Table
CREATE TABLE IF NOT EXISTS correction_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_code VARCHAR(50) UNIQUE NOT NULL,
    story_slug VARCHAR(255) NOT NULL,
    story_title VARCHAR(255) NOT NULL,
    submitter_name VARCHAR(255) NOT NULL,
    submitter_email VARCHAR(255) NOT NULL,
    issue_type VARCHAR(100) NOT NULL,
    correction_details TEXT NOT NULL,
    supporting_links TEXT[] DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, under_review, resolved, dismissed
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. 301 URL Redirects Table
CREATE TABLE IF NOT EXISTS url_redirects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_path VARCHAR(255) UNIQUE NOT NULL,
    to_path VARCHAR(255) NOT NULL,
    http_code INT NOT NULL DEFAULT 301,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for high performance queries
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_published_at ON stories(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_submissions_ticket ON story_submissions(ticket_code);
CREATE INDEX IF NOT EXISTS idx_corrections_ticket ON correction_tickets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_redirects_from ON url_redirects(from_path);
