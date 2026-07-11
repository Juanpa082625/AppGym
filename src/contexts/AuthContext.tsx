import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { AuthState } from '../types'
import { fetchProfile, fetchBusiness, signUp, signIn, signOut as authSignOut } from '../services/auth'
import type { SignUpParams, SignInParams } from '../services/auth'

interface AuthContextType extends AuthState {
  signUp: (params: SignUpParams) => Promise<void>
  signIn: (params: SignInParams) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    business: null,
    loading: true,
  })

  useEffect(() => {
    if (!supabase) {
      setState({ user: null, profile: null, business: null, loading: false })
      return
    }

    const supabaseClient = supabase

    const initSession = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession()
        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          const business = await fetchBusiness(profile.business_id)
          setState({ user: session.user, profile, business, loading: false })
        } else {
          setState({ user: null, profile: null, business: null, loading: false })
        }
      } catch {
        setState({ user: null, profile: null, business: null, loading: false })
      }
    }

    initSession()

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const profile = await fetchProfile(session.user.id)
          const business = await fetchBusiness(profile.business_id)
          setState({ user: session.user, profile, business, loading: false })
        } catch {
          setState({ user: session.user, profile: null, business: null, loading: false })
        }
      } else {
        setState({ user: null, profile: null, business: null, loading: false })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignUp = async (params: SignUpParams) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    console.log('🚀 Starting signup flow...')
    
    const signUpResult = await signUp(params)
    console.log('📝 Signup result:', signUpResult)
    
    // Esperar un momento para que el trigger cree el business y profile
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('🔑 Attempting auto-signin...')
    await signIn({ email: params.email, password: params.password })
    console.log('✅ Signup flow completed')
  }

  const handleSignIn = async (params: SignInParams) => {
    if (!supabase) throw new Error('Supabase not configured')
    await signIn(params)
  }

  const handleSignOut = async () => {
    if (!supabase) throw new Error('Supabase not configured')
    await authSignOut()
    setState({ user: null, profile: null, business: null, loading: false })
  }

  return (
    <AuthContext.Provider value={{ ...state, signUp: handleSignUp, signIn: handleSignIn, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
