-- ROI Calculator Analytics Database Schema
-- Execute this SQL in your Supabase SQL Editor to create the required tables

-- Table: roi_users
-- Purpose: Track unique users who access the ROI calculator
-- One row per verified email address
create table if not exists roi_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email text not null unique,
  first_seen_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

-- Enable Row Level Security
alter table roi_users enable row level security;

-- RLS Policies for roi_users
create policy "Users can view own data"
  on roi_users for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own data"
  on roi_users for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own data"
  on roi_users for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Table: roi_sessions
-- Purpose: Log each ROI calculation session for analytics
-- Tracks calculation inputs, outputs, and user context
create table if not exists roi_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_at timestamptz default now(),
  mode text not null,
  raw_input jsonb,
  roi_quarter numeric,
  roi_year numeric
);

-- Enable Row Level Security
alter table roi_sessions enable row level security;

-- RLS Policies for roi_sessions
create policy "Users can view own sessions"
  on roi_sessions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on roi_sessions for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Indexes for better query performance
create index if not exists idx_roi_users_user_id on roi_users(user_id);
create index if not exists idx_roi_users_email on roi_users(email);
create index if not exists idx_roi_sessions_user_id on roi_sessions(user_id);
create index if not exists idx_roi_sessions_created_at on roi_sessions(created_at desc);
