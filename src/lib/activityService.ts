import { supabase } from './supabaseClient'
import type { ActivityLog, ActivityPayload } from '../types/activity'

function generateId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

interface ActivityLogRow {
  id: string
  user_id: string
  type: ActivityLog['activity']['type']
  logged_at: string
  notes: string | null
  data: ActivityPayload['data']
}

function rowToLog(row: ActivityLogRow): ActivityLog {
  return {
    id: row.id,
    userId: row.user_id,
    loggedAt: row.logged_at,
    notes: row.notes ?? undefined,
    activity: { type: row.type, data: row.data } as ActivityPayload,
  }
}

const LS_KEY = 'fitlog_activities'

function lsGetAll(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ActivityLog[]
  } catch {
    return []
  }
}

function lsSave(logs: ActivityLog[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(logs))
}

function lsInsert(payload: ActivityPayload, notes?: string): ActivityLog {
  const log: ActivityLog = {
    id: generateId(),
    userId: 'local',
    loggedAt: new Date().toISOString(),
    notes,
    activity: payload,
  }
  const logs = lsGetAll()
  lsSave([log, ...logs])
  return log
}

function lsDelete(id: string): void {
  const logs = lsGetAll().filter(l => l.id !== id)
  lsSave(logs)
}

function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  return (
    !!url &&
    !!key &&
    url !== 'https://your-project-id.supabase.co' &&
    key !== 'your-anon-key-here'
  )
}

export async function fetchActivities(): Promise<ActivityLog[]> {
  if (!isSupabaseConfigured()) {
    return lsGetAll()
  }

  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('logged_at', { ascending: false })

  if (error) {
    console.warn('[FitLog] Supabase fetch failed, falling back to localStorage:', error.message)
    return lsGetAll()
  }

  return (data as ActivityLogRow[]).map(rowToLog)
}

export async function insertActivity(
  payload: ActivityPayload,
  notes?: string,
): Promise<ActivityLog> {
  if (!isSupabaseConfigured()) {
    return lsInsert(payload, notes)
  }

  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    console.warn('[FitLog] Not authenticated — saving to localStorage')
    return lsInsert(payload, notes)
  }

  const { data, error } = await supabase
    .from('activity_logs')
    .insert({
      user_id:   userData.user.id,
      type:      payload.type,
      data:      payload.data,
      notes:     notes ?? null,
      logged_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.warn('[FitLog] Supabase insert failed, falling back to localStorage:', error.message)
    return lsInsert(payload, notes)
  }

  return rowToLog(data as ActivityLogRow)
}

export async function deleteActivity(id: string): Promise<void> {

  if (id.startsWith('local-') || !isSupabaseConfigured()) {
    lsDelete(id)
    return
  }

  const { error } = await supabase.from('activity_logs').delete().eq('id', id)
  if (error) {
    console.warn('[FitLog] Supabase delete failed, removing from localStorage:', error.message)
    lsDelete(id)
  }
}

export { isSupabaseConfigured }
