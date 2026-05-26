import { Input } from '../ui/Input'
import type { BasketballFormState } from '../../types/activity'

interface BasketballFormProps {
  value: BasketballFormState
  onChange: (value: BasketballFormState) => void
}

export function BasketballForm({ value, onChange }: BasketballFormProps) {
  const update = <K extends keyof BasketballFormState>(
    key: K,
    val: BasketballFormState[K],
  ) => onChange({ ...value, [key]: val })

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <Input
        label="Duration"
        type="number"
        min={1}
        max={240}
        value={value.durationMin}
        onChange={e => update('durationMin', parseInt(e.target.value, 10) || 1)}
        inputMode="numeric"
        unit="min"
        hint="How long was the game or session?"
      />

      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Points"
          type="number"
          min={0}
          max={200}
          value={value.points}
          onChange={e => update('points', parseInt(e.target.value, 10) || 0)}
          inputMode="numeric"
        />
        <Input
          label="Rebounds"
          type="number"
          min={0}
          max={100}
          value={value.rebounds}
          onChange={e => update('rebounds', parseInt(e.target.value, 10) || 0)}
          inputMode="numeric"
        />
        <Input
          label="Assists"
          type="number"
          min={0}
          max={100}
          value={value.assists}
          onChange={e => update('assists', parseInt(e.target.value, 10) || 0)}
          inputMode="numeric"
        />
      </div>

      <div className="rounded-xl bg-surface-raised border border-surface-border px-4 py-3 grid grid-cols-3 text-center">
        <div>
          <p className="text-2xl font-bold text-amber-400">{value.points}</p>
          <p className="text-xs text-white/40 mt-0.5">PTS</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-sky-400">{value.rebounds}</p>
          <p className="text-xs text-white/40 mt-0.5">REB</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-emerald-400">{value.assists}</p>
          <p className="text-xs text-white/40 mt-0.5">AST</p>
        </div>
      </div>
    </div>
  )
}
