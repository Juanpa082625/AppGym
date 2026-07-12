import { supabase } from '../lib/supabase'
import type { Routine } from '../types-titanops'

export async function fetchRoutines(businessId: string): Promise<Routine[]> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('routines')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) throw error
  
  return (data || []).map(r => ({
    id: r.id,
    title: r.title,
    level: r.level as 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO',
    duration: r.duration,
    frequency: r.frequency,
    exercisesCount: r.exercises_count,
    assignedMembers: r.assigned_members,
    imageUrl: r.image_url || '',
    lastUpdated: new Date(r.last_updated).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }))
}

export async function createRoutine(
  businessId: string,
  routine: Omit<Routine, 'id' | 'lastUpdated'>
): Promise<Routine> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('routines')
    .insert({
      business_id: businessId,
      title: routine.title,
      level: routine.level,
      duration: routine.duration,
      frequency: routine.frequency,
      exercises_count: routine.exercisesCount,
      assigned_members: routine.assignedMembers,
      image_url: routine.imageUrl
    })
    .select()
    .single()

  if (error) throw error
  
  return {
    id: data.id,
    title: data.title,
    level: data.level as 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO',
    duration: data.duration,
    frequency: data.frequency,
    exercisesCount: data.exercises_count,
    assignedMembers: data.assigned_members,
    imageUrl: data.image_url || '',
    lastUpdated: new Date(data.last_updated).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }
}

export async function updateRoutine(
  routineId: string,
  updates: Partial<Omit<Routine, 'id' | 'lastUpdated'>>
): Promise<Routine> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const updateData: any = {}
  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.level !== undefined) updateData.level = updates.level
  if (updates.duration !== undefined) updateData.duration = updates.duration
  if (updates.frequency !== undefined) updateData.frequency = updates.frequency
  if (updates.exercisesCount !== undefined) updateData.exercises_count = updates.exercisesCount
  if (updates.assignedMembers !== undefined) updateData.assigned_members = updates.assignedMembers
  if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl
  updateData.last_updated = new Date().toISOString()

  const { data, error } = await supabase
    .from('routines')
    .update(updateData)
    .eq('id', routineId)
    .select()
    .single()

  if (error) throw error
  
  return {
    id: data.id,
    title: data.title,
    level: data.level as 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO',
    duration: data.duration,
    frequency: data.frequency,
    exercisesCount: data.exercises_count,
    assignedMembers: data.assigned_members,
    imageUrl: data.image_url || '',
    lastUpdated: new Date(data.last_updated).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }
}

export async function deleteRoutine(routineId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { error } = await supabase
    .from('routines')
    .delete()
    .eq('id', routineId)

  if (error) throw error
}
