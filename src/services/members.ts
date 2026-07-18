import { supabase } from '../lib/supabase'
import type { Member, MembershipStatus, PaymentMethod } from '../types-titanops'

// Calculate membership status based on plan end date
export function calculateMembershipStatus(planEndDate?: string): MembershipStatus {
  if (!planEndDate) return 'SIN_PLAN'
  
  const endDate = new Date(planEndDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)
  
  const daysUntilExpiry = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) return 'VENCIDA'
  if (daysUntilExpiry === 0) return 'VENCE_HOY'
  if (daysUntilExpiry <= 7) return 'PROXIMA_A_VENCER'
  return 'ACTIVA'
}

// Calculate days until expiry
export function calculateDaysUntilExpiry(planEndDate?: string): number | null {
  if (!planEndDate) return null
  
  const endDate = new Date(planEndDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)
  
  return Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

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
    coach: m.coach_name || '—',
    planStartDate: m.plan_start_date,
    planEndDate: m.plan_end_date,
    planValue: m.plan_value ? Number(m.plan_value) : undefined,
    planPaymentMethod: m.plan_payment_method as PaymentMethod | undefined,
    membershipStatus: calculateMembershipStatus(m.plan_end_date),
    daysUntilExpiry: calculateDaysUntilExpiry(m.plan_end_date) ?? undefined
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
      coach_name: member.coach,
      plan_start_date: member.planStartDate,
      plan_end_date: member.planEndDate,
      plan_value: member.planValue,
      plan_payment_method: member.planPaymentMethod
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
    coach: data.coach_name || '—',
    planStartDate: data.plan_start_date,
    planEndDate: data.plan_end_date,
    planValue: data.plan_value ? Number(data.plan_value) : undefined,
    planPaymentMethod: data.plan_payment_method as PaymentMethod | undefined,
    membershipStatus: calculateMembershipStatus(data.plan_end_date),
    daysUntilExpiry: calculateDaysUntilExpiry(data.plan_end_date) ?? undefined
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
  if (updates.planStartDate !== undefined) updateData.plan_start_date = updates.planStartDate
  if (updates.planEndDate !== undefined) updateData.plan_end_date = updates.planEndDate
  if (updates.planValue !== undefined) updateData.plan_value = updates.planValue
  if (updates.planPaymentMethod !== undefined) updateData.plan_payment_method = updates.planPaymentMethod

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
    coach: data.coach_name || '—',
    planStartDate: data.plan_start_date,
    planEndDate: data.plan_end_date,
    planValue: data.plan_value ? Number(data.plan_value) : undefined,
    planPaymentMethod: data.plan_payment_method as PaymentMethod | undefined,
    membershipStatus: calculateMembershipStatus(data.plan_end_date),
    daysUntilExpiry: calculateDaysUntilExpiry(data.plan_end_date) ?? undefined
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
