/*
  # ROI Calculator Analytics Tables

  1. New Tables
    - `roi_users`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `email` (text, unique)
      - `first_seen_at` (timestamptz)
      - `last_seen_at` (timestamptz)
      
    - `roi_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `mode` (text, 'automation' or 'agentic')
      - `raw_input` (jsonb, calculation inputs)
      - `roi_quarter` (numeric, quarterly ROI)
      - `roi_year` (numeric, annual ROI)

  2. Security
    - Enable RLS on both tables
    - Users can only view/insert/update their own data
    - Authenticated access only

  3. Performance
    - Indexes on user_id and email for fast lookups
    - Index on created_at for time-based queries
*/

-- Table: roi_users
create table if not exists roi_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email text not null unique,
  first_seen_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

alter table roi_users enable row level security;

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
create table if not exists roi_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_at timestamptz default now(),
  mode text not null,
  raw_input jsonb,
  roi_quarter numeric,
  roi_year numeric
);

alter table roi_sessions enable row level security;

create policy "Users can view own sessions"
  on roi_sessions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on roi_sessions for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Indexes
create index if not exists idx_roi_users_user_id on roi_users(user_id);
create index if not exists idx_roi_users_email on roi_users(email);
create index if not exists idx_roi_sessions_user_id on roi_sessions(user_id);
create index if not exists idx_roi_sessions_created_at on roi_sessions(created_at desc);
