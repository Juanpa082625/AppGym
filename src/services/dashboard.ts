import { supabase } from '../lib/supabase'
import type { DashboardStats } from '../types'

export async function fetchDashboardStats(businessId: string): Promise<DashboardStats | null> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('*')
    .eq('business_id', businessId)
    .eq('period', 'current')
    .single()

  if (error && error.code !== 'PGRST116') throw error
  if (error && error.code === 'PGRST116') return null
  return data as DashboardStats
}

export async function calculateAndSaveStats(businessId: string): Promise<DashboardStats> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select('risk_score, status')
    .eq('business_id', businessId)

  if (membersError) throw membersError

  const totalMembers = members?.length ?? 0
  const activeMembers = members?.filter(m => m.status === 'active').length ?? 0
  const highRiskCount = members?.filter(m => m.risk_score >= 60).length ?? 0
  const avgRiskScore = totalMembers > 0
    ? (members?.reduce((sum, m) => sum + m.risk_score, 0) ?? 0) / totalMembers
    : 0
  const retentionRate = totalMembers > 0
    ? (activeMembers / totalMembers) * 100
    : 0

  const { data, error } = await supabase
    .from('dashboard_stats')
    .upsert({
      business_id: businessId,
      retention_rate: Math.round(retentionRate * 100) / 100,
      avg_risk_score: Math.round(avgRiskScore * 100) / 100,
      high_risk_count: highRiskCount,
      total_members: totalMembers,
      active_members: activeMembers,
      period: 'current',
      calculated_at: new Date().toISOString(),
    }, {
      onConflict: 'business_id,period',
    })
    .select()
    .single()

  if (error) throw error
  return data as DashboardStats
}
