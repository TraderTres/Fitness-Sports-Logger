import { useCallback, useState } from 'react'
import type {
  ActivityFormState,
  ActivityType,
  BasketballFormState,
  HomeWorkoutFormState,
  JoggingFormState,
  WeightliftingFormState,
  ActivityPayload,
} from '../types/activity'

export type FormStep = 'pick' | 'fill' | 'confirm'

const DEFAULT_WEIGHTLIFTING: WeightliftingFormState = {
  exerciseName: '',
  sets: 3,
  reps: 10,
  weightKg: 20,
}

const DEFAULT_BASKETBALL: BasketballFormState = {
  durationMin: 60,
  points: 0,
  rebounds: 0,
  assists: 0,
}

const DEFAULT_JOGGING: JoggingFormState = {
  distanceKm: 5,
  durationMin: 30,
  paceMinkm: 6,
}

const DEFAULT_HOME_WORKOUT: HomeWorkoutFormState = {
  durationMin: 30,
  workoutType: 'HIIT',
  difficulty: 5,
}

function getDefaultFields(type: ActivityType): ActivityFormState {
  switch (type) {
    case 'weightlifting': return { type, fields: { ...DEFAULT_WEIGHTLIFTING } }
    case 'basketball':    return { type, fields: { ...DEFAULT_BASKETBALL } }
    case 'jogging':       return { type, fields: { ...DEFAULT_JOGGING } }
    case 'home_workout':  return { type, fields: { ...DEFAULT_HOME_WORKOUT } }
  }
}

function validateFormState(state: ActivityFormState): string[] {
  const errors: string[] = []
  switch (state.type) {
    case 'weightlifting':
      if (!state.fields.exerciseName.trim()) errors.push('Exercise name is required')
      if (state.fields.sets < 1) errors.push('Sets must be at least 1')
      if (state.fields.reps < 1) errors.push('Reps must be at least 1')
      if (state.fields.weightKg <= 0) errors.push('Weight must be greater than 0')
      break
    case 'basketball':
      if (state.fields.durationMin < 1) errors.push('Duration must be at least 1 minute')
      break
    case 'jogging':
      if (state.fields.distanceKm <= 0) errors.push('Distance must be greater than 0')
      if (state.fields.durationMin < 1) errors.push('Duration must be at least 1 minute')
      break
    case 'home_workout':
      if (state.fields.durationMin < 1) errors.push('Duration must be at least 1 minute')
      if (state.fields.difficulty < 1 || state.fields.difficulty > 10) errors.push('Difficulty must be 1–10')
      break
  }
  return errors
}

function buildPayload(state: ActivityFormState): ActivityPayload {
  switch (state.type) {
    case 'weightlifting':
      return { type: 'weightlifting', data: state.fields }
    case 'basketball':
      return { type: 'basketball', data: state.fields }
    case 'jogging': {
      const pace = state.fields.durationMin / state.fields.distanceKm
      return {
        type: 'jogging',
        data: { ...state.fields, paceMinkm: Math.round(pace * 100) / 100 },
      }
    }
    case 'home_workout':
      return { type: 'home_workout', data: state.fields }
  }
}

interface UseActivityFormReturn {
  step: FormStep
  formState: ActivityFormState | null
  notes: string
  validationErrors: string[]
  selectType: (type: ActivityType) => void
  updateFields: <T extends ActivityFormState>(fields: T['fields']) => void
  setNotes: (notes: string) => void
  goBack: () => void
  advance: () => void
  buildPayload: () => ActivityPayload
  reset: () => void
}

export function useActivityForm(): UseActivityFormReturn {
  const [step, setStep]                     = useState<FormStep>('pick')
  const [formState, setFormState]           = useState<ActivityFormState | null>(null)
  const [notes, setNotes]                   = useState('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const selectType = useCallback((type: ActivityType) => {
    setFormState(getDefaultFields(type))
    setStep('fill')
    setValidationErrors([])
  }, [])

  const updateFields = useCallback(<T extends ActivityFormState>(fields: T['fields']) => {
    setFormState(prev => {
      if (!prev) return prev
      return { ...prev, fields } as ActivityFormState
    })
  }, [])

  const advance = useCallback(() => {
    if (!formState) return
    const errors = validateFormState(formState)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }
    setValidationErrors([])
    setStep('confirm')
  }, [formState])

  const goBack = useCallback(() => {
    setStep(prev => {
      if (prev === 'fill')    return 'pick'
      if (prev === 'confirm') return 'fill'
      return prev
    })
    setValidationErrors([])
  }, [])

  const reset = useCallback(() => {
    setStep('pick')
    setFormState(null)
    setNotes('')
    setValidationErrors([])
  }, [])

  const buildPayloadFn = useCallback((): ActivityPayload => {
    if (!formState) throw new Error('No form state')
    return buildPayload(formState)
  }, [formState])

  return {
    step,
    formState,
    notes,
    validationErrors,
    selectType,
    updateFields,
    setNotes,
    goBack,
    advance,
    buildPayload: buildPayloadFn,
    reset,
  }
}
