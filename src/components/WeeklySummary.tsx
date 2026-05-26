import { useMemo } from 'react'
import { Card } from './ui/Card'
import type { ActivityLog, ActivityType } from '../types/activity'
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_EMOJIS,
  ACTIVITY_TYPE_COLORS,
} from '../types/activity'

interface WeeklySummaryProps {
  activities: ActivityLog[]
}

interface WeekStat {
  type: ActivityType
  count: number
  gradient: string
}

function getWeeklyStats(activities: ActivityLog[]): WeekStat[] {
  const weekStart = new Date()
  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())

  const counts: Record<ActivityType, number> = {
    weightlifting: 0,
    basketball: 0,
    jogging: 0,
    home_workout: 0,
  }

  for (const log of activities) {
    if (new Date(log.loggedAt) >= weekStart) {
      counts[log.activity.type]++
    }
  }

  const types: ActivityType[] = ['weightlifting', 'basketball', 'jogging', 'home_workout']
  return types
    .map(type => ({ type, count: counts[type], gradient: ACTIVITY_TYPE_COLORS[type] }))
    .sort((a, b) => b.count - a.count)
}

function getTotalThisWeek(activities: ActivityLog[]): number {
  const weekStart = new Date()
  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  return activities.filter(a => new Date(a.loggedAt) >= weekStart).length
}

function getStreak(activities: ActivityLog[]): number {
  if (activities.length === 0) return 0
  const days = new Set(
    activities.map(a => new Date(a.loggedAt).toDateString())
  )
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (days.has(d.toDateString())) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export function WeeklySummary({ activities }: WeeklySummaryProps) {
  const weeklyStats = useMemo(() => getWeeklyStats(activities), [activities])
  const totalWeek   = useMemo(() => getTotalThisWeek(activities), [activities])
  const streak      = useMemo(() => getStreak(activities), [activities])

  return (
    <div className="flex flex-col gap-4">

      <div className="grid grid-cols-2 gap-3">
        <Card padding="md" className="text-center">
          <p className="text-4xl font-extrabold bg-gradient-to-br from-brand-400 to-brand-300 bg-clip-text text-transparent">
            {totalWeek}
          </p>
          <p className="text-xs text-white/40 mt-1.5 font-medium uppercase tracking-wide">
            This Week
          </p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-4xl font-extrabold bg-gradient-to-br from-amber-400 to-orange-400 bg-clip-text text-transparent">
            {streak}🔥
          </p>
          <p className="text-xs text-white/40 mt-1.5 font-medium uppercase tracking-wide">
            Day Streak
          </p>
        </Card>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-surface-border">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Weekly Breakdown</p>
        </div>
        <div className="divide-y divide-surface-border">
          {weeklyStats.map(({ type, count, gradient }) => (
            <div key={type} className="flex items-center gap-3 px-4 py-3">
              <span className="text-xl w-7 text-center flex-shrink-0" role="img" aria-label={ACTIVITY_TYPE_LABELS[type]}>
                {ACTIVITY_TYPE_EMOJIS[type]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80 truncate">
                  {ACTIVITY_TYPE_LABELS[type]}
                </p>

                <div className="mt-1.5 h-1.5 bg-surface-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
                    style={{ width: `${Math.min(100, (count / Math.max(totalWeek, 1)) * 100)}%` }}
                  />
                </div>
              </div>
              <span className={`text-sm font-bold ${count > 0 ? 'text-white' : 'text-white/20'}`}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
