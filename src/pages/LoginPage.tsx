import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const [view, setView] = useState<'login' | 'register'>('login')
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSignIn = async (params: { email: string; password: string }) => {
    await signIn(params)
    navigate('/dashboard')
  }

  const handleSignUp = async (params: { email: string; password: string; fullName: string; businessName: string }) => {
    await signUp(params)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {view === 'login' ? (
          <LoginForm
            onSignIn={handleSignIn}
            onSwitchToRegister={() => setView('register')}
          />
        ) : (
          <RegisterForm
            onSignUp={handleSignUp}
            onSwitchToLogin={() => setView('login')}
          />
        )}
      </div>
    </div>
  )
}

interface LoginFormProps {
  onSignIn: (params: { email: string; password: string }) => Promise<void>
  onSwitchToRegister: () => void
}

function LoginForm({ onSignIn, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await onSignIn({ email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-3">
        Bienvenido de vuelta
      </div>
      <h1 className="text-3xl font-semibold mb-2">Iniciá sesión</h1>
      <p className="text-sm text-gray-600 mb-8">
        ¿Sos nuevo?{' '}
        <button onClick={onSwitchToRegister} className="text-brand-500 font-medium hover:underline">
          Creá una cuenta
        </button>
      </p>

      <form onSubmit={handleSubmit} className="text-left space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:border-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-3 pr-11 text-sm border border-gray-300 rounded-lg bg-white focus:border-brand-500 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        <Link to="#" className="block text-right text-sm text-brand-500 font-medium hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-sm text-gray-500">o continuá con</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <button className="w-full py-3.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:border-gray-900 transition-colors flex items-center justify-center gap-2.5">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar con Google
      </button>
    </>
  )
}

interface RegisterFormProps {
  onSignUp: (params: { email: string; password: string; fullName: string; businessName: string }) => Promise<void>
  onSwitchToLogin: () => void
}

function RegisterForm({ onSignUp, onSwitchToLogin }: RegisterFormProps) {
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      await onSignUp({ email, password, fullName, businessName })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-3">
        Empezá hoy gratis
      </div>
      <h1 className="text-3xl font-semibold mb-2">Creá tu cuenta</h1>
      <p className="text-sm text-gray-600 mb-8">
        ¿Ya tenés cuenta?{' '}
        <button onClick={onSwitchToLogin} className="text-brand-500 font-medium hover:underline">
          Iniciá sesión
        </button>
      </p>

      <form onSubmit={handleSubmit} className="text-left space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">Nombre</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre"
            required
            className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:border-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Nombre del gimnasio</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Ej: Iron Strength"
            required
            className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:border-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:border-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-3 pr-11 text-sm border border-gray-300 rounded-lg bg-white focus:border-brand-500 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Confirmar contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:border-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-sm text-gray-500">o continuá con</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <button className="w-full py-3.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:border-gray-900 transition-colors flex items-center justify-center gap-2.5">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar con Google
      </button>
    </>
  )
}
