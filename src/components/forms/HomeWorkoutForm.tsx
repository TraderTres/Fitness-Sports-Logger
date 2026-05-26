import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import type { HomeWorkoutFormState } from '../../types/activity'
import { HOME_WORKOUT_TYPES } from '../../types/activity'

interface HomeWorkoutFormProps {
  value: HomeWorkoutFormState
  onChange: (value: HomeWorkoutFormState) => void
}

const WORKOUT_OPTIONS = HOME_WORKOUT_TYPES.map(t => ({ value: t, label: t }))

const DIFFICULTY_LABELS: Record<number, { label: string; color: string }> = {
  1:  { label: 'Very Easy',  color: 'text-emerald-400' },
  2:  { label: 'Easy',       color: 'text-emerald-400' },
  3:  { label: 'Moderate',   color: 'text-lime-400' },
  4:  { label: 'Moderate',   color: 'text-lime-400' },
  5:  { label: 'Challenging',color: 'text-yellow-400' },
  6:  { label: 'Challenging',color: 'text-yellow-400' },
  7:  { label: 'Hard',       color: 'text-amber-400' },
  8:  { label: 'Very Hard',  color: 'text-orange-400' },
  9:  { label: 'Intense',    color: 'text-rose-400' },
  10: { label: 'MAX EFFORT', color: 'text-red-400 font-bold' },
}

export function HomeWorkoutForm({ value, onChange }: HomeWorkoutFormProps) {
  const update = <K extends keyof HomeWorkoutFormState>(
    key: K,
    val: HomeWorkoutFormState[K],
  ) => onChange({ ...value, [key]: val })

  const diffInfo = DIFFICULTY_LABELS[value.difficulty] ?? DIFFICULTY_LABELS[5]

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Workout Type"
          options={WORKOUT_OPTIONS}
          value={value.workoutType}
          onChange={e => update('workoutType', e.target.value as HomeWorkoutFormState['workoutType'])}
        />
        <Input
          label="Duration"
          type="number"
          min={1}
          max={300}
          value={value.durationMin}
          onChange={e => update('durationMin', parseInt(e.target.value, 10) || 1)}
          inputMode="numeric"
          unit="min"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white/70">Perceived Difficulty</label>
          <span className={`text-sm font-semibold ${diffInfo.color}`}>
            {value.difficulty}/10 — {diffInfo.label}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value.difficulty}
          onChange={e => update('difficulty', parseInt(e.target.value, 10))}
          className="w-full h-2 rounded-full appearance-none bg-surface-border cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6
                     [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:cursor-pointer"
          aria-label="Difficulty"
        />
        <div className="flex justify-between text-xs text-white/30 px-0.5">
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <span key={n} className={n === value.difficulty ? 'text-brand-400 font-bold' : ''}>
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
