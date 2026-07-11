import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Navbar() {
  const { user, business, signOut } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Get<span className="text-brand-500">Gym</span>
          </Link>

          {user && business && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {business.name}
              </span>
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:border-gray-900 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          )}

          {!user && (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:border-gray-900 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Probar gratis
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
