# FitLog — Fitness & Sports Logger

A mobile-first fitness tracking web app built with **React + TypeScript + Tailwind CSS**, backed by **Supabase**.

## Features

- 📊 **Weekly Dashboard** — activity count, day streak, per-type progress bars
- 🏋️🏀🏃🏠 **4 Activity Types** — Weightlifting, Basketball, Jogging, Home Workout
- 📝 **3-Step Log Form** — pick type → fill fields → confirm (with auto-calculated jogging pace)
- 🗂️ **History Feed** — grouped by date, filterable by activity type
- 🔒 **Per-user data** — Supabase Auth + Row Level Security

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript (strict) |
| Bundler | Vite 5 |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Icons | Lucide React |
| Backend | Supabase (Postgres + Auth + RLS) |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New Query**, paste and run the contents of `supabase/schema.sql`
3. Enable **Email Auth** under Authentication → Providers
4. Copy your project URL and `anon` key from **Settings → API**

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser (or on your phone via local network).

### 5. Build for production

```bash
npm run build
```

## Project Structure

```
src/
├── types/activity.ts          # Discriminated union types (no `any`)
├── lib/
│   ├── supabaseClient.ts      # Supabase singleton
│   └── activityService.ts     # CRUD operations
├── hooks/
│   ├── useActivities.ts       # Activity list state
│   └── useActivityForm.ts     # Multi-step form state machine
├── components/
│   ├── ui/                    # Button, Card, Input, Select, Badge, Modal
│   ├── forms/                 # WeightliftingForm, BasketballForm, JoggingForm, HomeWorkoutForm
│   ├── ActivityForm.tsx       # 3-step form orchestrator
│   ├── ActivityCard.tsx       # Single history entry
│   ├── ActivityFeed.tsx       # Date-grouped list
│   ├── ActivityTypePicker.tsx # Step 1 big-tap grid
│   ├── WeeklySummary.tsx      # Dashboard stats widget
│   └── BottomNav.tsx          # Fixed bottom navigation
└── pages/
    ├── Dashboard.tsx          # Home screen
    └── History.tsx            # Full history + filters
```

## Type Safety

All activity data is typed as a **discriminated union** — no `any` anywhere:

```ts
type ActivityPayload =
  | { type: 'weightlifting'; data: WeightliftingData }
  | { type: 'basketball';    data: BasketballData }
  | { type: 'jogging';       data: JoggingData }
  | { type: 'home_workout';  data: HomeWorkoutData }
```