import type { User } from '@supabase/supabase-js'

// Auth types
export interface AuthState {
  user: User | null
  profile: Profile | null
  business: Business | null
  loading: boolean
}

export interface Profile {
  id: string
  business_id: string
  full_name: string
  role: 'owner' | 'admin' | 'staff'
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  name: string
  slug: string
  plan: string
  location?: string
  country?: string
  website?: string
  phone?: string
  hours?: string
  created_at: string
  updated_at: string
}

// TitanOps types
export interface GymSettings {
  name: string
  slug: string
  location: string
  country: string
  website: string
  phone: string
  hours: string
}

export type RiskLevel = 'ALTO' | 'MEDIO' | 'BAJO'
export type MemberStatus = 'ACTIVO' | 'EN_RIESGO' | 'ATRASADO' | 'PAUSADO' | 'NUEVO' | 'CANCELADO'
export type PaymentStatus = 'PAGADO' | 'PENDIENTE' | 'ATRASADO'
export type RoutineLevel = 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO'

export interface Member {
  id: string
  name: string
  email: string
  photoUrl: string
  registrationDate: string
  plan: string
  status: MemberStatus
  risk: RiskLevel
  riskScore: number
  lastVisit: string
  coach: string
}

export interface Routine {
  id: string
  title: string
  level: RoutineLevel
  duration: string
  frequency: string
  exercisesCount: number
  assignedMembers: number
  imageUrl: string
  lastUpdated: string
}

export interface Coach {
  id: string
  name: string
  email: string
  photoUrl: string
  assignedMembers: number
  joinDate: string
  status: 'ALTA' | 'BAJA'
}

export interface Payment {
  id: string
  member: string
  concept: string
  amount: number
  method: 'Tarjeta' | 'Efectivo' | 'Transferencia'
  date: string
  status: PaymentStatus
}

export interface HelpSection {
  id: string
  title: string
  description: string
  icon: string
}
