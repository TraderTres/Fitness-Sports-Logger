import { Input } from '../ui/Input'
import type { WeightliftingFormState } from '../../types/activity'

interface WeightliftingFormProps {
  value: WeightliftingFormState
  onChange: (value: WeightliftingFormState) => void
}

export function WeightliftingForm({ value, onChange }: WeightliftingFormProps) {
  const update = <K extends keyof WeightliftingFormState>(
    key: K,
    val: WeightliftingFormState[K],
  ) => onChange({ ...value, [key]: val })

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <Input
        label="Exercise Name"
        placeholder="e.g. Bench Press, Squat…"
        value={value.exerciseName}
        onChange={e => update('exerciseName', e.target.value)}
        autoComplete="off"
        autoCapitalize="words"
      />

      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Sets"
          type="number"
          min={1}
          max={20}
          value={value.sets}
          onChange={e => update('sets', parseInt(e.target.value, 10) || 1)}
          inputMode="numeric"
        />
        <Input
          label="Reps"
          type="number"
          min={1}
          max={100}
          value={value.reps}
          onChange={e => update('reps', parseInt(e.target.value, 10) || 1)}
          inputMode="numeric"
        />
        <Input
          label="Weight"
          type="number"
          min={0}
          step={0.5}
          value={value.weightKg}
          onChange={e => update('weightKg', parseFloat(e.target.value) || 0)}
          inputMode="decimal"
          unit="kg"
        />
      </div>

      <p className="text-center text-sm text-white/40">
        {value.sets} sets × {value.reps} reps @ {value.weightKg} kg
        {' '}= <span className="text-white/70 font-semibold">{(value.sets * value.reps * value.weightKg).toLocaleString()} kg total volume</span>
      </p>
    </div>
  )
}
