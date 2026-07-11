export interface Business {
  id: string
  name: string
  slug: string
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export type MemberRole = 'owner' | 'admin' | 'staff'

export interface Profile {
  id: string
  business_id: string
  full_name: string
  role: MemberRole
  phone: string | null
  created_at: string
  updated_at: string
}

export type MemberStatus = 'active' | 'inactive' | 'at_risk'

export interface Member {
  id: string
  business_id: string
  full_name: string
  email: string | null
  phone: string | null
  status: MemberStatus
  risk_score: number
  risk_reasons: string[]
  join_date: string
  last_visit: string | null
  monthly_fee: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  id: string
  business_id: string
  retention_rate: number
  avg_risk_score: number
  high_risk_count: number
  total_members: number
  active_members: number
  period: string
  calculated_at: string
}

export interface AuthState {
  user: import('@supabase/supabase-js').User | null
  profile: Profile | null
  business: Business | null
  loading: boolean
}
