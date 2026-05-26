import { Input } from '../ui/Input'
import type { JoggingFormState } from '../../types/activity'

interface JoggingFormProps {
  value: JoggingFormState
  onChange: (value: JoggingFormState) => void
}

function calcPace(distanceKm: number, durationMin: number): number {
  if (distanceKm <= 0) return 0
  return Math.round((durationMin / distanceKm) * 100) / 100
}

function formatPace(paceMinkm: number): string {
  if (paceMinkm <= 0) return '—'
  const mins = Math.floor(paceMinkm)
  const secs = Math.round((paceMinkm - mins) * 60)
  return `${mins}:${secs.toString().padStart(2, '0')} /km`
}

export function JoggingForm({ value, onChange }: JoggingFormProps) {
  const update = <K extends keyof JoggingFormState>(
    key: K,
    val: JoggingFormState[K],
  ) => {
    const next = { ...value, [key]: val }

    if (key === 'distanceKm' || key === 'durationMin') {
      next.paceMinkm = calcPace(
        key === 'distanceKm' ? (val as number) : next.distanceKm,
        key === 'durationMin' ? (val as number) : next.durationMin,
      )
    }
    onChange(next)
  }

  const pace = calcPace(value.distanceKm, value.durationMin)

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Distance"
          type="number"
          min={0.1}
          step={0.1}
          value={value.distanceKm}
          onChange={e => update('distanceKm', parseFloat(e.target.value) || 0.1)}
          inputMode="decimal"
          unit="km"
        />
        <Input
          label="Duration"
          type="number"
          min={1}
          value={value.durationMin}
          onChange={e => update('durationMin', parseInt(e.target.value, 10) || 1)}
          inputMode="numeric"
          unit="min"
        />
      </div>

      <div className="rounded-xl bg-surface-raised border border-emerald-500/30 px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40 font-medium uppercase tracking-wide">Avg Pace</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">{formatPace(pace)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/40 font-medium uppercase tracking-wide">Speed</p>
          <p className="text-xl font-semibold text-white/70 mt-1">
            {pace > 0 ? `${(60 / pace).toFixed(1)} km/h` : '—'}
          </p>
        </div>
      </div>

      <Input
        label="Manual Pace Override"
        type="number"
        min={1}
        step={0.01}
        value={value.paceMinkm}
        onChange={e => onChange({ ...value, paceMinkm: parseFloat(e.target.value) || pace })}
        inputMode="decimal"
        unit="min/km"
        hint="Auto-calculated from distance & duration. Override if needed."
      />
    </div>
  )
}
