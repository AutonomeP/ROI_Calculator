# ROI Calculator Setup Guide

## Database Setup

This application requires two database tables for email authentication and analytics tracking.

### Step 1: Execute SQL Schema

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `src/lib/database-schema.sql`
4. Paste and execute the SQL to create:
   - `roi_users` table - tracks verified users
   - `roi_sessions` table - logs ROI calculations

The schema includes:
- Proper Row Level Security (RLS) policies
- Indexes for performance
- Automatic timestamps

### Step 2: Verify Tables

After execution, verify in the Table Editor that both tables exist with RLS enabled.

## Authentication Flow

### Email Gate (Magic Link)

Users must verify their email before accessing the calculator:

1. **First Visit**: Email gate modal appears
2. **User enters email**: System sends magic link via Supabase Auth
3. **User clicks link**: Authentication session created
4. **Access granted**: Calculator becomes available

### Returning Users

- Sessions persist in browser localStorage
- No re-verification needed if session is valid
- Session automatically refreshes while active

## Analytics Tracking

### User Tracking

When authenticated, users are automatically tracked in `roi_users`:
- First visit: New record created with `first_seen_at`
- Return visits: `last_seen_at` updated

### Session Logging

ROI calculations are logged to `roi_sessions` after 3 seconds of inactivity:
- Captures calculation mode (automation/agentic)
- Stores anonymized input parameters
- Records key ROI metrics (quarterly and annual)

## Environment Variables

Required variables (already configured):
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Security

- Email OTP authentication via Supabase Auth
- Row Level Security ensures users only access their own data
- Input data is sanitized before storage
- No sensitive financial data stored
