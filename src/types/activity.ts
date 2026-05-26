

export type ActivityType =
  | 'weightlifting'
  | 'basketball'
  | 'jogging'
  | 'home_workout'

export interface WeightliftingData {
  exerciseName: string
  sets: number
  reps: number
  weightKg: number
}

export interface BasketballData {
  durationMin: number
  points: number
  rebounds: number
  assists: number
}

export interface JoggingData {
  distanceKm: number
  durationMin: number

  paceMinkm: number
}

export type HomeWorkoutType = 'HIIT' | 'Yoga' | 'Pilates' | 'Stretching' | 'Calisthenics' | 'Other'

export interface HomeWorkoutData {
  durationMin: number
  workoutType: HomeWorkoutType

  difficulty: number
}

export type ActivityPayload =
  | { type: 'weightlifting'; data: WeightliftingData }
  | { type: 'basketball';    data: BasketballData }
  | { type: 'jogging';       data: JoggingData }
  | { type: 'home_workout';  data: HomeWorkoutData }

export interface ActivityLog {
  id: string
  userId: string
  loggedAt: string   // ISO 8601 timestamp
  notes?: string
  activity: ActivityPayload
}

export type WeightliftingFormState = WeightliftingData
export type BasketballFormState    = BasketballData
export type JoggingFormState       = Omit<JoggingData, 'paceMinkm'> & { paceMinkm: number }
export type HomeWorkoutFormState   = HomeWorkoutData

export type ActivityFormState =
  | { type: 'weightlifting'; fields: WeightliftingFormState }
  | { type: 'basketball';    fields: BasketballFormState }
  | { type: 'jogging';       fields: JoggingFormState }
  | { type: 'home_workout';  fields: HomeWorkoutFormState }

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  weightlifting: 'Weightlifting',
  basketball:    'Basketball',
  jogging:       'Jogging',
  home_workout:  'Home Workout',
}

export const ACTIVITY_TYPE_EMOJIS: Record<ActivityType, string> = {
  weightlifting: '🏋️',
  basketball:    '🏀',
  jogging:       '🏃',
  home_workout:  '💪',
}

export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  weightlifting: 'from-violet-600 to-indigo-600',
  basketball:    'from-orange-500 to-amber-500',
  jogging:       'from-emerald-500 to-teal-500',
  home_workout:  'from-pink-500 to-rose-500',
}

export const ACTIVITY_TYPE_ACCENT: Record<ActivityType, string> = {
  weightlifting: 'text-indigo-400',
  basketball:    'text-amber-400',
  jogging:       'text-emerald-400',
  home_workout:  'text-rose-400',
}

export const HOME_WORKOUT_TYPES: HomeWorkoutType[] = [
  'HIIT', 'Yoga', 'Pilates', 'Stretching', 'Calisthenics', 'Other',
]
