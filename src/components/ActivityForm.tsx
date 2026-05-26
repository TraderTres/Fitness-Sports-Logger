import { useState } from 'react'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { ActivityTypePicker } from './ActivityTypePicker'
import { WeightliftingForm } from './forms/WeightliftingForm'
import { BasketballForm } from './forms/BasketballForm'
import { JoggingForm } from './forms/JoggingForm'
import { HomeWorkoutForm } from './forms/HomeWorkoutForm'
import { useActivityForm } from '../hooks/useActivityForm'
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_EMOJIS,
  ACTIVITY_TYPE_COLORS,
} from '../types/activity'
import type { ActivityFormState, ActivityPayload } from '../types/activity'

interface ActivityFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: ActivityPayload, notes?: string) => Promise<void>
}

function renderSubForm(
  formState: ActivityFormState,
  onChange: (fields: ActivityFormState['fields']) => void,
) {
  switch (formState.type) {
    case 'weightlifting':
      return (
        <WeightliftingForm
          value={formState.fields}
          onChange={fields => onChange(fields)}
        />
      )
    case 'basketball':
      return (
        <BasketballForm
          value={formState.fields}
          onChange={fields => onChange(fields)}
        />
      )
    case 'jogging':
      return (
        <JoggingForm
          value={formState.fields}
          onChange={fields => onChange(fields)}
        />
      )
    case 'home_workout':
      return (
        <HomeWorkoutForm
          value={formState.fields}
          onChange={fields => onChange(fields)}
        />
      )
  }
}

function ConfirmSummary({ formState }: { formState: ActivityFormState }) {
  const rows: Array<{ label: string; value: string }> = []

  switch (formState.type) {
    case 'weightlifting':
      rows.push(
        { label: 'Exercise', value: formState.fields.exerciseName || '—' },
        { label: 'Sets × Reps', value: `${formState.fields.sets} × ${formState.fields.reps}` },
        { label: 'Weight', value: `${formState.fields.weightKg} kg` },
        { label: 'Total Volume', value: `${(formState.fields.sets * formState.fields.reps * formState.fields.weightKg).toLocaleString()} kg` },
      )
      break
    case 'basketball':
      rows.push(
        { label: 'Duration', value: `${formState.fields.durationMin} min` },
        { label: 'Points', value: String(formState.fields.points) },
        { label: 'Rebounds', value: String(formState.fields.rebounds) },
        { label: 'Assists', value: String(formState.fields.assists) },
      )
      break
    case 'jogging':
      rows.push(
        { label: 'Distance', value: `${formState.fields.distanceKm} km` },
        { label: 'Duration', value: `${formState.fields.durationMin} min` },
        { label: 'Pace', value: `${formState.fields.paceMinkm} min/km` },
      )
      break
    case 'home_workout':
      rows.push(
        { label: 'Type', value: formState.fields.workoutType },
        { label: 'Duration', value: `${formState.fields.durationMin} min` },
        { label: 'Difficulty', value: `${formState.fields.difficulty}/10` },
      )
      break
  }

  return (
    <div className="rounded-xl bg-surface-raised border border-surface-border overflow-hidden">
      {rows.map(({ label, value }, i) => (
        <div
          key={label}
          className={[
            'flex items-center justify-between px-4 py-3',
            i < rows.length - 1 && 'border-b border-surface-border',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="text-sm text-white/50">{label}</span>
          <span className="text-sm font-semibold text-white">{value}</span>
        </div>
      ))}
    </div>
  )
}

export function ActivityForm({ isOpen, onClose, onSubmit }: ActivityFormProps) {
  const {
    step,
    formState,
    notes,
    validationErrors,
    selectType,
    updateFields,
    setNotes,
    goBack,
    advance,
    buildPayload,
    reset,
  } = useActivityForm()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const payload = buildPayload()
      await onSubmit(payload, notes.trim() || undefined)
      reset()
      onClose()
    } catch (err) {
      console.error('Failed to save activity:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const modalTitle = step === 'pick'
    ? 'Log Activity'
    : step === 'fill' && formState
    ? `${ACTIVITY_TYPE_EMOJIS[formState.type]} ${ACTIVITY_TYPE_LABELS[formState.type]}`
    : 'Confirm & Save'

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>

      <div className="flex items-center gap-2 mb-5">
        {(['pick', 'fill', 'confirm'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={[
                'h-1 flex-1 rounded-full transition-all duration-300',
                i <= (['pick', 'fill', 'confirm'] as const).indexOf(step)
                  ? formState
                    ? `bg-gradient-to-r ${ACTIVITY_TYPE_COLORS[formState.type]}`
                    : 'bg-brand-500'
                  : 'bg-surface-border',
              ].join(' ')}
            />
          </div>
        ))}
      </div>

      {step === 'pick' && (
        <ActivityTypePicker onSelect={selectType} />
      )}

      {step === 'fill' && formState && (
        <div className="flex flex-col gap-5">
          {renderSubForm(formState, updateFields)}

          {validationErrors.length > 0 && (
            <div className="flex flex-col gap-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3">
              {validationErrors.map(err => (
                <p key={err} className="flex items-center gap-2 text-sm text-rose-400">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {err}
                </p>
              ))}
            </div>
          )}

          <Input
            label="Notes (optional)"
            placeholder="Any extra details, PRs, feelings…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" onClick={goBack} className="flex-1" leftIcon={<ArrowLeft size={16} />}>
              Back
            </Button>
            <Button onClick={advance} className="flex-2 flex-grow-[2]">
              Review →
            </Button>
          </div>
        </div>
      )}

      {step === 'confirm' && formState && (
        <div className="flex flex-col gap-5">
          <div className="text-center py-2">
            <span className="text-5xl">{ACTIVITY_TYPE_EMOJIS[formState.type]}</span>
            <p className="text-lg font-bold text-white mt-2">{ACTIVITY_TYPE_LABELS[formState.type]}</p>
            <p className="text-sm text-white/40 mt-0.5">Ready to save</p>
          </div>

          <ConfirmSummary formState={formState} />

          {notes && (
            <p className="text-sm text-white/50 italic px-1">
              📝 "{notes}"
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" onClick={goBack} className="flex-1" leftIcon={<ArrowLeft size={16} />}>
              Edit
            </Button>
            <Button
              onClick={() => void handleSubmit()}
              isLoading={isSubmitting}
              className="flex-2 flex-grow-[2]"
              leftIcon={<CheckCircle2 size={16} />}
            >
              Save Activity
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
