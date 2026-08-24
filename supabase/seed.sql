-- Eternal Paws Clean Database Initialization (PostgreSQL / Supabase)
-- Fresh Setup: 0 Stories, Clean Initial State, Super Admin Pre-Configured

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
    ('user-admin-001', 'admin@eternal-paws.org', 'Super Admin', 'super_admin', 'active'),
    ('user-admin-002', 'elena.rostova@eternal-paws.com', 'Elena Rostova', 'fact_checker', 'active'),
    ('user-admin-003', 'sarah.miller@eternal-paws.com', 'Sarah Miller', 'editor', 'active')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, status = EXCLUDED.status;

-- 2. Clean Initial Production Newsletter Subscriber
INSERT INTO newsletter_subscribers (email, status, source_channel, subscribed_at)
VALUES ('admin@eternal-paws.org', 'active', 'super_admin_verified', NOW())
ON CONFLICT (email) DO NOTHING;
