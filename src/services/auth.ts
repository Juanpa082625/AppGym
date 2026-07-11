import { supabase } from '../lib/supabase'
import type { Profile, Business } from '../types'

export interface SignUpParams {
  email: string
  password: string
  fullName: string
  businessName: string
}

export interface SignInParams {
  email: string
  password: string
}

export async function signUp({ email, password, fullName, businessName }: SignUpParams) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const slug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  console.log('🔐 Attempting signup for:', email)
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        business_name: businessName,
        business_slug: slug || `gym-${Date.now()}`,
      },
    },
  })

  if (error) {
    console.error('❌ Signup error:', error)
    throw error
  }
  
  console.log('✅ Signup successful:', data)
  
  if (!data.user) {
    throw new Error('No se pudo crear el usuario. Por favor intenta de nuevo.')
  }
  
  return data
}

export async function signIn({ email, password }: SignInParams) {
  if (!supabase) throw new Error('Supabase not configured')
  
  console.log('🔑 Attempting signin for:', email)
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('❌ Signin error:', error)
    throw error
  }
  
  console.log('✅ Signin successful:', data)
  return data
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function resetPassword(email: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
}

export async function getCurrentSession() {
  if (!supabase) throw new Error('Supabase not configured')
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export async function fetchProfile(userId: string): Promise<Profile> {
  if (!supabase) throw new Error('Supabase not configured')
  
  console.log('👤 Fetching profile for user:', userId)
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('❌ Fetch profile error:', error)
    throw error
  }
  
  console.log('✅ Profile fetched:', data)
  return data as Profile
}

export async function fetchBusiness(businessId: string): Promise<Business> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single()

  if (error) throw error
  return data as Business
}
