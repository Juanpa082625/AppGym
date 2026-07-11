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
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
    await signUp(params)
  }

  const handleSignIn = async (params: SignInParams) => {
    await signIn(params)
  }

  const handleSignOut = async () => {
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
