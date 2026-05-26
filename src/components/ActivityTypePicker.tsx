import type { ActivityType } from '../types/activity'
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_EMOJIS,
  ACTIVITY_TYPE_COLORS,
} from '../types/activity'

const ALL_TYPES: ActivityType[] = ['weightlifting', 'basketball', 'jogging', 'home_workout']

interface ActivityTypePickerProps {
  onSelect: (type: ActivityType) => void
}

export function ActivityTypePicker({ onSelect }: ActivityTypePickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-white/50 text-center mb-1">What did you do today?</p>
      <div className="grid grid-cols-2 gap-3">
        {ALL_TYPES.map(type => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={[
              'relative overflow-hidden rounded-2xl p-5',
              'flex flex-col items-center gap-3 min-h-[120px]',
              'bg-gradient-to-br transition-all duration-200',
              'active:scale-95 hover:scale-[1.02] hover:shadow-xl',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
              ACTIVITY_TYPE_COLORS[type],
            ].join(' ')}
            aria-label={`Log ${ACTIVITY_TYPE_LABELS[type]}`}
          >

            <div className="absolute inset-0 opacity-20 blur-2xl bg-white rounded-full scale-50" />

            <span className="relative text-4xl" role="img" aria-hidden="true">
              {ACTIVITY_TYPE_EMOJIS[type]}
            </span>
            <span className="relative text-sm font-bold text-white text-center leading-tight">
              {ACTIVITY_TYPE_LABELS[type]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
