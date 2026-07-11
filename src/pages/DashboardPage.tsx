import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { fetchHighRiskMembers, fetchMembers, createMember, deleteMember } from '../services/members'
import { fetchDashboardStats, calculateAndSaveStats } from '../services/dashboard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { Member, DashboardStats } from '../types'

export function DashboardPage() {
  const { profile, business } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [highRisk, setHighRisk] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    if (!profile?.business_id) return

    const loadData = async () => {
      try {
        setLoading(true)
        const [statsData, membersData, highRiskData] = await Promise.all([
          fetchDashboardStats(profile.business_id),
          fetchMembers(profile.business_id),
          fetchHighRiskMembers(profile.business_id),
        ])
        setStats(statsData)
        setMembers(membersData)
        setHighRisk(highRiskData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [profile?.business_id])

  const handleAddMember = async (memberData: {
    full_name: string
    email: string
    phone: string
    monthly_fee: number
  }) => {
    if (!profile?.business_id) return

    try {
      const newMember = await createMember(profile.business_id, {
        full_name: memberData.full_name,
        email: memberData.email || null,
        phone: memberData.phone || null,
        join_date: new Date().toISOString().split('T')[0]!,
        last_visit: null,
        monthly_fee: memberData.monthly_fee,
        notes: null,
      })
      setMembers(prev => [newMember, ...prev])
      setShowAddForm(false)

      const updatedStats = await calculateAndSaveStats(profile.business_id)
      setStats(updatedStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar miembro')
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!profile?.business_id) return
    if (!confirm('¿Estás seguro de eliminar este miembro?')) return

    try {
      await deleteMember(memberId)
      setMembers(prev => prev.filter(m => m.id !== memberId))
      setHighRisk(prev => prev.filter(m => m.id !== memberId))

      const updatedStats = await calculateAndSaveStats(profile.business_id)
      setStats(updatedStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar miembro')
    }
  }

  if (loading) return <LoadingSpinner size="lg" />

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Buen día, {profile?.full_name}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {business?.name} · {stats?.total_members ?? 0} miembros activos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Score promedio"
          value={stats?.avg_risk_score?.toFixed(0) ?? '0'}
          color="text-gray-900"
        />
        <StatCard
          label="Retención"
          value={`${stats?.retention_rate?.toFixed(0) ?? '0'}%`}
          color="text-green-600"
        />
        <StatCard
          label="Riesgo alto"
          value={stats?.high_risk_count?.toString() ?? '0'}
          color="text-red-600"
        />
        <StatCard
          label="Total miembros"
          value={stats?.total_members?.toString() ?? '0'}
          color="text-gray-900"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Todos los miembros</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                + Agregar miembro
              </button>
            </div>

            {showAddForm && (
              <AddMemberForm
                onAdd={handleAddMember}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            {members.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No hay miembros todavía. Agregá el primero.
              </p>
            ) : (
              <div className="space-y-2">
                {members.map(member => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    onDelete={handleDeleteMember}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Miembros en riesgo</h2>
            {highRisk.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay miembros en riesgo alto
              </p>
            ) : (
              <div className="space-y-3">
                {highRisk.map(member => (
                  <div key={member.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{member.full_name}</div>
                      <div className="text-xs text-gray-500">
                        Score: {member.risk_score}
                      </div>
                    </div>
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="text-xs font-semibold text-brand-500 hover:text-brand-600"
                      >
                        Llamar
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  )
}

function MemberRow({ member, onDelete }: { member: Member; onDelete: (id: string) => void }) {
  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    at_risk: 'bg-red-100 text-red-700',
  }

  const statusLabels = {
    active: 'Activo',
    inactive: 'Inactivo',
    at_risk: 'En riesgo',
  }

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-surface rounded-lg">
      <div className="flex-1">
        <div className="text-sm font-medium">{member.full_name}</div>
        <div className="text-xs text-gray-500">
          {member.email ?? 'Sin email'} · Score: {member.risk_score}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[member.status]}`}>
          {statusLabels[member.status]}
        </span>
        <button
          onClick={() => onDelete(member.id)}
          className="text-xs text-red-600 hover:text-red-700 font-medium"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

function AddMemberForm({
  onAdd,
  onCancel,
}: {
  onAdd: (data: { full_name: string; email: string; phone: string; monthly_fee: number }) => void
  onCancel: () => void
}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [monthlyFee, setMonthlyFee] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      full_name: fullName,
      email,
      phone,
      monthly_fee: parseFloat(monthlyFee) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-surface rounded-lg space-y-3">
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Nombre completo"
        required
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:border-brand-500 focus:outline-none"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (opcional)"
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:border-brand-500 focus:outline-none"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Teléfono (opcional)"
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:border-brand-500 focus:outline-none"
        />
      </div>
      <input
        type="number"
        value={monthlyFee}
        onChange={(e) => setMonthlyFee(e.target.value)}
        placeholder="Cuota mensual"
        step="0.01"
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:border-brand-500 focus:outline-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:border-gray-900 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
