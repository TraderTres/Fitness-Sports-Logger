import { useState } from 'react'
import { Plus, Zap, CloudOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WeeklySummary } from '../components/WeeklySummary'
import { ActivityFeed } from '../components/ActivityFeed'
import { ActivityForm } from '../components/ActivityForm'
import { Button } from '../components/ui/Button'
import { useActivities } from '../hooks/useActivities'
import { isSupabaseConfigured } from '../lib/activityService'
import type { ActivityPayload } from '../types/activity'

export function Dashboard() {
  const { activities, isLoading, error, addActivity, removeActivity } = useActivities()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleSubmit = async (payload: ActivityPayload, notes?: string) => {
    await addActivity(payload, notes)
  }

  return (
    <div className="min-h-dvh page-scroll scrollbar-thin">
      <header className="px-4 md:px-8 pt-10 md:pt-14 pb-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -top-6 right-24 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl">
          <div className="flex items-center gap-2 mb-1 md:hidden">
            <Zap size={14} className="text-brand-400" />
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">FitLog</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Your <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </header>

      <div className="px-4 md:px-8 pb-24 md:pb-8 max-w-7xl">
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10">

          <div className="lg:col-span-5 flex flex-col gap-4 mb-6 lg:mb-0">
            <Button
              size="lg"
              onClick={() => setIsFormOpen(true)}
              className="w-full rounded-2xl text-base"
              leftIcon={<Plus size={20} />}
              id="log-activity-btn"
            >
              Log Activity
            </Button>

            {!isSupabaseConfigured() && (
              <div className="flex items-start gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 px-4 py-3">
                <CloudOff size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-400">Running in local mode</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    Data is saved on this device only. Connect Supabase in <code className="text-amber-400/80">.env.local</code> to sync across devices.
                  </p>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2].map(i => (
                  <div key={i} className="h-24 rounded-2xl bg-surface-card animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-400">
                ⚠️ {error}
              </div>
            ) : (
              <WeeklySummary activities={activities} />
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">Recent Activity</h2>
              <Link
                to="/history"
                className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                See all →
              </Link>
            </div>
            <ActivityFeed
              activities={activities}
              onDelete={id => void removeActivity(id)}
              limit={5}
            />
          </div>

        </div>
      </div>

      <ActivityForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
