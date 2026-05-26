import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ActivityFeed } from '../components/ActivityFeed'
import { ActivityForm } from '../components/ActivityForm'
import { Button } from '../components/ui/Button'
import { useActivities } from '../hooks/useActivities'
import type { ActivityLog, ActivityPayload, ActivityType } from '../types/activity'
import { ACTIVITY_TYPE_LABELS } from '../types/activity'

const FILTER_OPTIONS: Array<{ value: 'all' | ActivityType; label: string }> = [
  { value: 'all',          label: 'All' },
  { value: 'weightlifting', label: '🏋️ Gym' },
  { value: 'basketball',   label: '🏀 Basketball' },
  { value: 'jogging',      label: '🏃 Jogging' },
  { value: 'home_workout', label: '💪 Home' },
]

export function History() {
  const { activities, isLoading, error, addActivity, removeActivity } = useActivities()
  const [filter, setFilter]       = useState<'all' | ActivityType>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const filtered: ActivityLog[] = filter === 'all'
    ? activities
    : activities.filter(a => a.activity.type === filter)

  const handleSubmit = async (payload: ActivityPayload, notes?: string) => {
    await addActivity(payload, notes)
  }

  return (
    <main className="page-scroll scrollbar-thin">

      <header className="px-4 pt-12 pb-4">
        <h1 className="text-3xl font-extrabold text-white">
          Activity <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">History</span>
        </h1>
        <p className="text-sm text-white/40 mt-1">
          {activities.length} {activities.length === 1 ? 'session' : 'sessions'} logged
        </p>
      </header>

      <div className="px-4 flex flex-col gap-4 pb-4">

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={[
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150',
                filter === opt.value
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-surface-card border border-surface-border text-white/50 hover:text-white',
              ].join(' ')}
              aria-pressed={filter === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3 pt-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-2xl bg-surface-card animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-400 mt-2">
            ⚠️ {error}
          </div>
        ) : (
          <ActivityFeed
            activities={filtered}
            onDelete={id => void removeActivity(id)}
          />
        )}

        {!isLoading && !error && filtered.length === 0 && activities.length > 0 && (
          <div className="text-center py-10 text-white/40 text-sm">
            No {filter !== 'all' ? ACTIVITY_TYPE_LABELS[filter] : ''} sessions yet.
          </div>
        )}
      </div>

      <div className="fixed bottom-20 right-4 z-30" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <Button
          onClick={() => setIsFormOpen(true)}
          size="lg"
          className="rounded-full shadow-xl shadow-brand-500/30 w-14 h-14 p-0"
          aria-label="Log new activity"
          id="history-fab-btn"
        >
          <Plus size={24} />
        </Button>
      </div>

      <ActivityForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
