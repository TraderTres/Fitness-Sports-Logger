import { ActivityCard } from './ActivityCard'
import type { ActivityLog } from '../types/activity'
import { Dumbbell } from 'lucide-react'

interface ActivityFeedProps {
  activities: ActivityLog[]
  onDelete?: (id: string) => void

  limit?: number
}

function groupByDate(logs: ActivityLog[]): Array<{ dateLabel: string; items: ActivityLog[] }> {
  const groups = new Map<string, ActivityLog[]>()

  for (const log of logs) {
    const d = new Date(log.loggedAt)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000)

    let label: string
    if (diffDays === 0) label = 'Today'
    else if (diffDays === 1) label = 'Yesterday'
    else label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

    const existing = groups.get(label) ?? []
    existing.push(log)
    groups.set(label, existing)
  }

  return Array.from(groups.entries()).map(([dateLabel, items]) => ({ dateLabel, items }))
}

export function ActivityFeed({ activities, onDelete, limit }: ActivityFeedProps) {
  const displayed = limit ? activities.slice(0, limit) : activities

  if (displayed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-raised flex items-center justify-center">
          <Dumbbell size={28} className="text-white/20" />
        </div>
        <div>
          <p className="text-white/50 font-medium">No activities yet</p>
          <p className="text-sm text-white/30 mt-1">Tap the button below to log your first workout!</p>
        </div>
      </div>
    )
  }

  const groups = groupByDate(displayed)

  return (
    <div className="flex flex-col gap-6">
      {groups.map(({ dateLabel, items }) => (
        <section key={dateLabel}>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 px-1">
            {dateLabel}
          </p>
          <div className="flex flex-col gap-3">
            {items.map(log => (
              <ActivityCard key={log.id} log={log} onDelete={onDelete} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
