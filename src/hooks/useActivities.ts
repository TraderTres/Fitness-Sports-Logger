import { useCallback, useEffect, useState } from 'react'
import {
  fetchActivities,
  insertActivity,
  deleteActivity,
} from '../lib/activityService'
import type { ActivityLog, ActivityPayload } from '../types/activity'

interface UseActivitiesReturn {
  activities: ActivityLog[]
  isLoading: boolean
  error: string | null
  addActivity: (payload: ActivityPayload, notes?: string) => Promise<void>
  removeActivity: (id: string) => Promise<void>
  refetch: () => Promise<void>
}

export function useActivities(): UseActivitiesReturn {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [error, setError]           = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchActivities()
      setActivities(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activities')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const addActivity = useCallback(async (payload: ActivityPayload, notes?: string) => {
    const newLog = await insertActivity(payload, notes)
    setActivities(prev => [newLog, ...prev])
  }, [])

  const removeActivity = useCallback(async (id: string) => {
    await deleteActivity(id)
    setActivities(prev => prev.filter(a => a.id !== id))
  }, [])

  return {
    activities,
    isLoading,
    error,
    addActivity,
    refetch: load,
    removeActivity,
  }
}
