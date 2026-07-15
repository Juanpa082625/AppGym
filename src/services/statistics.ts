import { supabase } from '../lib/supabase'

export interface DashboardStats {
  totalMembers: number
  activeMembers: number
  highRiskMembers: number
  mediumRiskMembers: number
  lowRiskMembers: number
  newMembersThisMonth: number
  totalRevenueThisMonth: number
  pendingPayments: number
  overduePayments: number
}

export async function calculateDashboardStats(businessId: string): Promise<DashboardStats> {
  if (!supabase) throw new Error('Supabase not configured')

  // Get current date for month calculations
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Fetch all members
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select('*')
    .eq('business_id', businessId)

  if (membersError) throw membersError

  // Fetch all payments for this month
  const { data: payments, error: paymentsError } = await supabase
    .from('payments')
    .select('*')
    .eq('business_id', businessId)
    .gte('payment_date', firstDayOfMonth.toISOString())

  if (paymentsError) throw paymentsError

  // Calculate statistics
  const totalMembers = members?.length || 0
  const activeMembers = members?.filter(m => 
    m.status === 'ACTIVO' || m.status === 'NUEVO'
  ).length || 0

  const highRiskMembers = members?.filter(m => m.risk_level === 'ALTO').length || 0
  const mediumRiskMembers = members?.filter(m => m.risk_level === 'MEDIO').length || 0
  const lowRiskMembers = members?.filter(m => m.risk_level === 'BAJO').length || 0

  const newMembersThisMonth = members?.filter(m => {
    const joinDate = new Date(m.join_date)
    return joinDate >= firstDayOfMonth
  }).length || 0

  const totalRevenueThisMonth = payments
    ?.filter(p => p.status === 'PAGADO')
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0

  const pendingPayments = payments
    ?.filter(p => p.status === 'PENDIENTE')
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0

  const overduePayments = payments
    ?.filter(p => p.status === 'ATRASADO')
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0

  return {
    totalMembers,
    activeMembers,
    highRiskMembers,
    mediumRiskMembers,
    lowRiskMembers,
    newMembersThisMonth,
    totalRevenueThisMonth,
    pendingPayments,
    overduePayments
  }
}
