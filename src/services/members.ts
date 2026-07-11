import { supabase } from '../lib/supabase'
import type { Member } from '../types'

export async function fetchMembers(businessId: string): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('business_id', businessId)
    .order('risk_score', { ascending: false })

  if (error) throw error
  return data as Member[]
}

export async function fetchHighRiskMembers(businessId: string): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('business_id', businessId)
    .gte('risk_score', 60)
    .order('risk_score', { ascending: false })
    .limit(10)

  if (error) throw error
  return data as Member[]
}

export async function createMember(
  businessId: string,
  member: Omit<Member, 'id' | 'business_id' | 'created_at' | 'updated_at' | 'risk_score' | 'risk_reasons' | 'status'>
): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .insert({
      business_id: businessId,
      full_name: member.full_name,
      email: member.email,
      phone: member.phone,
      join_date: member.join_date,
      last_visit: member.last_visit,
      monthly_fee: member.monthly_fee,
      notes: member.notes,
      status: 'active',
      risk_score: 0,
      risk_reasons: [],
    })
    .select()
    .single()

  if (error) throw error
  return data as Member
}

export async function updateMember(
  memberId: string,
  updates: Partial<Pick<Member, 'full_name' | 'email' | 'phone' | 'status' | 'last_visit' | 'monthly_fee' | 'notes'>>
): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', memberId)
    .select()
    .single()

  if (error) throw error
  return data as Member
}

export async function deleteMember(memberId: string): Promise<void> {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', memberId)

  if (error) throw error
}
