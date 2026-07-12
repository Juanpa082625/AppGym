import { supabase } from '../lib/supabase'
import type { Coach } from '../types-titanops'

export async function fetchCoaches(businessId: string): Promise<Coach[]> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) throw error
  
  return (data || []).map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    photoUrl: c.photo_url || '',
    assignedMembers: c.assigned_members,
    joinDate: new Date(c.join_date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    status: c.status as 'ALTA' | 'BAJA'
  }))
}

export async function createCoach(
  businessId: string,
  coach: Omit<Coach, 'id' | 'joinDate'>
): Promise<Coach> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('coaches')
    .insert({
      business_id: businessId,
      name: coach.name,
      email: coach.email,
      photo_url: coach.photoUrl,
      assigned_members: coach.assignedMembers,
      status: coach.status
    })
    .select()
    .single()

  if (error) throw error
  
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    photoUrl: data.photo_url || '',
    assignedMembers: data.assigned_members,
    joinDate: new Date(data.join_date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    status: data.status as 'ALTA' | 'BAJA'
  }
}

export async function updateCoach(
  coachId: string,
  updates: Partial<Omit<Coach, 'id' | 'joinDate'>>
): Promise<Coach> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const updateData: any = {}
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.email !== undefined) updateData.email = updates.email
  if (updates.photoUrl !== undefined) updateData.photo_url = updates.photoUrl
  if (updates.assignedMembers !== undefined) updateData.assigned_members = updates.assignedMembers
  if (updates.status !== undefined) updateData.status = updates.status

  const { data, error } = await supabase
    .from('coaches')
    .update(updateData)
    .eq('id', coachId)
    .select()
    .single()

  if (error) throw error
  
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    photoUrl: data.photo_url || '',
    assignedMembers: data.assigned_members,
    joinDate: new Date(data.join_date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    status: data.status as 'ALTA' | 'BAJA'
  }
}

export async function deleteCoach(coachId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { error } = await supabase
    .from('coaches')
    .delete()
    .eq('id', coachId)

  if (error) throw error
}
