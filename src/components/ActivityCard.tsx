import { Trash2 } from 'lucide-react'
import { Card } from './ui/Card'
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_EMOJIS,
  ACTIVITY_TYPE_COLORS,
  ACTIVITY_TYPE_ACCENT,
} from '../types/activity'
import type { ActivityLog } from '../types/activity'

interface ActivityCardProps {
  log: ActivityLog
  onDelete?: (id: string) => void
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function ActivityStats({ log }: { log: ActivityLog }) {
  const { activity } = log

  switch (activity.type) {
    case 'weightlifting':
      return (
        <div className="flex gap-3 flex-wrap">
          <StatPill label="Exercise" value={activity.data.exerciseName} accent="text-indigo-400" />
          <StatPill label="Sets" value={String(activity.data.sets)} accent="text-indigo-400" />
          <StatPill label="Reps" value={String(activity.data.reps)} accent="text-indigo-400" />
          <StatPill label="Weight" value={`${activity.data.weightKg}kg`} accent="text-indigo-400" />
        </div>
      )
    case 'basketball':
      return (
        <div className="flex gap-3 flex-wrap">
          <StatPill label="Duration" value={`${activity.data.durationMin}m`} accent="text-amber-400" />
          <StatPill label="PTS" value={String(activity.data.points)} accent="text-amber-400" />
          <StatPill label="REB" value={String(activity.data.rebounds)} accent="text-amber-400" />
          <StatPill label="AST" value={String(activity.data.assists)} accent="text-amber-400" />
        </div>
      )
    case 'jogging':
      return (
        <div className="flex gap-3 flex-wrap">
          <StatPill label="Distance" value={`${activity.data.distanceKm}km`} accent="text-emerald-400" />
          <StatPill label="Duration" value={`${activity.data.durationMin}m`} accent="text-emerald-400" />
          <StatPill label="Pace" value={`${activity.data.paceMinkm}/km`} accent="text-emerald-400" />
        </div>
      )
    case 'home_workout':
      return (
        <div className="flex gap-3 flex-wrap">
          <StatPill label="Type" value={activity.data.workoutType} accent="text-rose-400" />
          <StatPill label="Duration" value={`${activity.data.durationMin}m`} accent="text-rose-400" />
          <StatPill label="Difficulty" value={`${activity.data.difficulty}/10`} accent="text-rose-400" />
        </div>
      )
  }
}

function StatPill({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex flex-col items-center bg-surface-raised rounded-lg px-3 py-2 min-w-[52px]">
      <span className={`text-base font-bold ${accent}`}>{value}</span>
      <span className="text-[10px] text-white/40 uppercase tracking-wide mt-0.5">{label}</span>
    </div>
  )
}

export function ActivityCard({ log, onDelete }: ActivityCardProps) {
  const { activity } = log
  const gradientClass = ACTIVITY_TYPE_COLORS[activity.type]
  const accentClass   = ACTIVITY_TYPE_ACCENT[activity.type]

  return (
    <Card className="relative overflow-hidden animate-fade-in" padding="none">

      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradientClass}`} />

      <div className="pl-5 pr-4 py-4 flex flex-col gap-3">

        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" role="img" aria-label={ACTIVITY_TYPE_LABELS[activity.type]}>
              {ACTIVITY_TYPE_EMOJIS[activity.type]}
            </span>
            <div>
              <p className={`font-bold text-sm ${accentClass}`}>
                {ACTIVITY_TYPE_LABELS[activity.type]}
              </p>
              <p className="text-xs text-white/40 mt-0.5">
                {formatDate(log.loggedAt)} · {formatTime(log.loggedAt)}
              </p>
            </div>
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(log.id)}
              className="touch-target flex items-center justify-center rounded-xl text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-auto flex-shrink-0"
              aria-label="Delete activity"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <ActivityStats log={log} />

        {log.notes && (
          <p className="text-xs text-white/40 italic border-t border-surface-border pt-2.5">
            📝 {log.notes}
          </p>
        )}
      </div>
    </Card>
  )
}
