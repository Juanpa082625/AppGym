import { supabase } from '../lib/supabase'
import type { Member } from '../types-titanops'

export async function fetchMembers(businessId: string): Promise<Member[]> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) throw error
  
  return (data || []).map(m => ({
    id: m.id,
    name: m.full_name,
    email: m.email || '',
    photoUrl: m.photo_url || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?w=150&auto=format&fit=crop&q=80`,
    registrationDate: new Date(m.join_date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    plan: m.plan || 'Mensual',
    status: m.status as 'ACTIVO' | 'EN_RIESGO' | 'ATRASADO' | 'PAUSADO' | 'NUEVO' | 'CANCELADO',
    risk: m.risk_level as 'ALTO' | 'MEDIO' | 'BAJO',
    riskScore: m.risk_score,
    lastVisit: m.last_visit ? `hace ${Math.floor((Date.now() - new Date(m.last_visit).getTime()) / (1000 * 60 * 60 * 24))} días` : 'hace 1 días',
    coach: m.coach_name || '—'
  }))
}

export async function createMember(
  businessId: string,
  member: Omit<Member, 'id' | 'registrationDate' | 'lastVisit'>
): Promise<Member> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('members')
    .insert({
      business_id: businessId,
      full_name: member.name,
      email: member.email,
      photo_url: member.photoUrl,
      plan: member.plan,
      status: member.status,
      risk_level: member.risk,
      risk_score: member.riskScore,
      coach_name: member.coach
    })
    .select()
    .single()

  if (error) throw error
  
  return {
    id: data.id,
    name: data.full_name,
    email: data.email || '',
    photoUrl: data.photo_url || '',
    registrationDate: new Date(data.join_date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    plan: data.plan || 'Mensual',
    status: data.status as 'ACTIVO' | 'EN_RIESGO' | 'ATRASADO' | 'PAUSADO' | 'NUEVO' | 'CANCELADO',
    risk: data.risk_level as 'ALTO' | 'MEDIO' | 'BAJO',
    riskScore: data.risk_score,
    lastVisit: data.last_visit ? `hace ${Math.floor((Date.now() - new Date(data.last_visit).getTime()) / (1000 * 60 * 60 * 24))} días` : 'hace 1 días',
    coach: data.coach_name || '—'
  }
}

export async function updateMember(
  memberId: string,
  updates: Partial<Omit<Member, 'id' | 'registrationDate' | 'lastVisit'>>
): Promise<Member> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const updateData: any = {}
  if (updates.name !== undefined) updateData.full_name = updates.name
  if (updates.email !== undefined) updateData.email = updates.email
  if (updates.photoUrl !== undefined) updateData.photo_url = updates.photoUrl
  if (updates.plan !== undefined) updateData.plan = updates.plan
  if (updates.status !== undefined) updateData.status = updates.status
  if (updates.risk !== undefined) updateData.risk_level = updates.risk
  if (updates.riskScore !== undefined) updateData.risk_score = updates.riskScore
  if (updates.coach !== undefined) updateData.coach_name = updates.coach

  const { data, error } = await supabase
    .from('members')
    .update(updateData)
    .eq('id', memberId)
    .select()
    .single()

  if (error) throw error
  
  return {
    id: data.id,
    name: data.full_name,
    email: data.email || '',
    photoUrl: data.photo_url || '',
    registrationDate: new Date(data.join_date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    plan: data.plan || 'Mensual',
    status: data.status as 'ACTIVO' | 'EN_RIESGO' | 'ATRASADO' | 'PAUSADO' | 'NUEVO' | 'CANCELADO',
    risk: data.risk_level as 'ALTO' | 'MEDIO' | 'BAJO',
    riskScore: data.risk_score,
    lastVisit: data.last_visit ? `hace ${Math.floor((Date.now() - new Date(data.last_visit).getTime()) / (1000 * 60 * 60 * 24))} días` : 'hace 1 días',
    coach: data.coach_name || '—'
  }
}

export async function deleteMember(memberId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', memberId)

  if (error) throw error
}
