-- ============================================================
--  FitLog — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Activity Logs Table ──────────────────────────────────────

create table if not exists activity_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null
                check (type in ('weightlifting', 'basketball', 'jogging', 'home_workout')),
  logged_at   timestamptz not null default now(),
  notes       text,
  data        jsonb not null,
  created_at  timestamptz not null default now()
);

-- ─── JSONB data shapes (documentation) ───────────────────────
--
--  type = 'weightlifting'
--    data: { "exerciseName": string, "sets": int, "reps": int, "weightKg": float }
--
--  type = 'basketball'
--    data: { "durationMin": int, "points": int, "rebounds": int, "assists": int }
--
--  type = 'jogging'
--    data: { "distanceKm": float, "durationMin": int, "paceMinkm": float }
--
--  type = 'home_workout'
--    data: { "durationMin": int, "workoutType": string, "difficulty": int (1-10) }

-- ─── Indexes ─────────────────────────────────────────────────

create index if not exists idx_activity_logs_user_date
  on activity_logs (user_id, logged_at desc);

create index if not exists idx_activity_logs_type
  on activity_logs (user_id, type);

-- ─── Row Level Security ───────────────────────────────────────

alter table activity_logs enable row level security;

-- Users can only select, insert, update, delete their own rows
create policy "Users manage own logs"
  on activity_logs
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── Optional: enable Realtime ───────────────────────────────
-- Run in Dashboard → Database → Replication
-- alter publication supabase_realtime add table activity_logs;
