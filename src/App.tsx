import { useState, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Members from './components/Members'
import Routines from './components/Routines'
import Coaches from './components/Coaches'
import Reports from './components/Reports'
import Payments from './components/Payments'
import Configuration from './components/Configuration'
import Help from './components/Help'
import LandingPage from './components/LandingPage'
import { LoadingSpinner } from './components/LoadingSpinner'

import type { GymSettings, Member, Routine, Coach, Payment } from './types-titanops'
import type { Report } from './services/reports'
import type { DashboardStats } from './services/statistics'

import { fetchMembers, createMember, updateMember, deleteMember } from './services/members'
import { fetchRoutines, createRoutine, updateRoutine, deleteRoutine } from './services/routines'
import { fetchCoaches, createCoach, updateCoach, deleteCoach } from './services/coaches'
import { fetchPayments, createPayment, updatePayment, deletePayment } from './services/payments'
import { fetchReports, createReport, deleteReport } from './services/reports'
import { fetchGymSettings, updateGymSettings } from './services/gymSettings'
import { calculateDashboardStats } from './services/statistics'

export default function App() {
  const { user, business, profile, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [gymSettings, setGymSettings] = useState<GymSettings | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [routines, setRoutines] = useState<Routine[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  
  const [searchVal, setSearchVal] = useState<string>("")
  const [memberFilter, setMemberFilter] = useState<string>("Todos")
  const [dataLoading, setDataLoading] = useState(true)

  // Load all data when user logs in
  useEffect(() => {
    if (!user || !business?.id) return

    const loadAllData = async () => {
      try {
        setDataLoading(true)
        const [membersData, routinesData, coachesData, paymentsData, reportsData, settingsData, statsData] = await Promise.all([
          fetchMembers(business.id),
          fetchRoutines(business.id),
          fetchCoaches(business.id),
          fetchPayments(business.id),
          fetchReports(business.id),
          fetchGymSettings(business.id),
          calculateDashboardStats(business.id)
        ])

        setMembers(membersData)
        setRoutines(routinesData)
        setCoaches(coachesData)
        setPayments(paymentsData)
        setReports(reportsData)
        setGymSettings(settingsData)
        setDashboardStats(statsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setDataLoading(false)
      }
    }

    loadAllData()
  }, [user, business?.id])

  // Handlers for Members
  const handleAddMember = async (newMember: Member) => {
    if (!business?.id) return
    try {
      const created = await createMember(business.id, newMember)
      setMembers([created, ...members])
    } catch (error) {
      console.error('Error creating member:', error)
    }
  }

  const handleUpdateMember = async (updated: Member) => {
    try {
      const result = await updateMember(updated.id, updated)
      setMembers(members.map(m => m.id === updated.id ? result : m))
    } catch (error) {
      console.error('Error updating member:', error)
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    try {
      await deleteMember(memberId)
      setMembers(members.filter(m => m.id !== memberId))
    } catch (error) {
      console.error('Error deleting member:', error)
    }
  }

  // Handlers for Routines
  const handleAddRoutine = async (newRoutine: Routine) => {
    if (!business?.id) return
    try {
      const created = await createRoutine(business.id, newRoutine)
      setRoutines([created, ...routines])
    } catch (error) {
      console.error('Error creating routine:', error)
    }
  }

  const handleUpdateRoutine = async (updated: Routine) => {
    try {
      const result = await updateRoutine(updated.id, updated)
      setRoutines(routines.map(r => r.id === updated.id ? result : r))
    } catch (error) {
      console.error('Error updating routine:', error)
    }
  }

  const handleDeleteRoutine = async (routineId: string) => {
    try {
      await deleteRoutine(routineId)
      setRoutines(routines.filter(r => r.id !== routineId))
    } catch (error) {
      console.error('Error deleting routine:', error)
    }
  }

  // Handlers for Coaches
  const handleAddCoach = async (newCoach: Coach) => {
    if (!business?.id) return
    try {
      const created = await createCoach(business.id, newCoach)
      setCoaches([created, ...coaches])
    } catch (error) {
      console.error('Error creating coach:', error)
    }
  }

  const handleUpdateCoach = async (updated: Coach) => {
    try {
      const result = await updateCoach(updated.id, updated)
      setCoaches(coaches.map(c => c.id === updated.id ? result : c))
    } catch (error) {
      console.error('Error updating coach:', error)
    }
  }

  const handleDeleteCoach = async (coachId: string) => {
    try {
      await deleteCoach(coachId)
      setCoaches(coaches.filter(c => c.id !== coachId))
    } catch (error) {
      console.error('Error deleting coach:', error)
    }
  }

  // Handlers for Payments
  const handleAddPayment = async (newPayment: Payment) => {
    if (!business?.id) return
    try {
      const created = await createPayment(business.id, newPayment)
      setPayments([created, ...payments])
    } catch (error) {
      console.error('Error creating payment:', error)
    }
  }

  const handleUpdatePayment = async (updated: Payment) => {
    try {
      const result = await updatePayment(updated.id, updated)
      setPayments(payments.map(p => p.id === updated.id ? result : p))
    } catch (error) {
      console.error('Error updating payment:', error)
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    try {
      await deletePayment(paymentId)
      setPayments(payments.filter(p => p.id !== paymentId))
    } catch (error) {
      console.error('Error deleting payment:', error)
    }
  }

  // Handlers for Reports
  const handleGenerateReport = async () => {
    if (!business?.id || !gymSettings) return
    
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    const now = new Date()
    const currentMonth = monthNames[now.getMonth()]
    const currentYear = now.getFullYear()
    const reportTitle = `Reporte ${currentMonth} ${currentYear} · ${gymSettings.name}`

    if (reports.some(r => r.title === reportTitle)) {
      alert('El reporte para este periodo ya ha sido generado.')
      return
    }

    try {
      const created = await createReport(business.id, {
        title: reportTitle,
        type: 'MENSUAL',
        membersCount: members.length
      })
      setReports([created, ...reports])
    } catch (error) {
      console.error('Error creating report:', error)
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteReport(reportId)
      setReports(reports.filter(r => r.id !== reportId))
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  // Handler for Gym Settings
  const handleSaveSettings = async (updated: GymSettings) => {
    if (!business?.id) return
    try {
      const result = await updateGymSettings(business.id, updated)
      setGymSettings(result)
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  const handleNotificationClick = () => {
    const riskCount = members.filter(m => m.risk === 'ALTO' || m.risk === 'MEDIO').length
    alert(`Notificaciones de TitanOps:\nTienes ${riskCount} miembros en riesgo que requieren tu atención hoy.`)
  }

  const handleGenerateReportFromDashboard = () => {
    setActiveTab('reportes')
  }

  // Handle logout with proper session cleanup
  const handleLogout = async () => {
    try {
      await signOut()
      // Clear all local state
      setMembers([])
      setRoutines([])
      setCoaches([])
      setPayments([])
      setReports([])
      setGymSettings(null)
      setActiveTab('dashboard')
      setSearchVal('')
      setMemberFilter('Todos')
      
      // Navigate to login and replace history to prevent back button
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Error during logout:', error)
      // Force navigation even if signOut fails
      navigate('/login', { replace: true })
    }
  }

  // Prevent back button navigation after logout
  useEffect(() => {
    if (!user && !authLoading) {
      // Add history entry to prevent back button
      window.history.pushState(null, '', window.location.href)
      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href)
      }
      window.addEventListener('popstate', handlePopState)
      return () => window.removeEventListener('popstate', handlePopState)
    }
  }, [user, authLoading])

  // Show loading spinner while auth is loading
  if (authLoading) {
    return <LoadingSpinner />
  }

  // Show landing page if not logged in
  if (!user) {
    return <LandingPage onLogin={() => navigate('/login')} gymSettings={gymSettings || { name: 'GetGym', slug: 'getgym', location: '', country: '', website: '', phone: '', hours: '' }} />
  }

  // Show loading spinner while data is loading
  if (dataLoading || !gymSettings || !dashboardStats) {
    return <LoadingSpinner />
  }

  // Calculate risk count for sidebar badge
  const riskCount = members.filter(m => m.risk === 'ALTO' || m.risk === 'MEDIO').length

  // Render main content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            gymSettings={gymSettings} 
            members={members}
            stats={dashboardStats}
            setActiveTab={setActiveTab}
            setMemberFilter={setMemberFilter}
            onGenerateReport={handleGenerateReportFromDashboard}
          />
        )
      case 'miembros':
        return (
          <Members 
            gymSettings={gymSettings} 
            members={members} 
            onAddMember={handleAddMember}
            filterFromDashboard={memberFilter}
            setFilterFromDashboard={setMemberFilter}
            searchVal={searchVal}
          />
        )
      case 'rutinas':
        return (
          <Routines 
            gymSettings={gymSettings} 
            routines={routines} 
            onAddRoutine={handleAddRoutine}
            onUpdateRoutine={handleUpdateRoutine}
            searchVal={searchVal}
          />
        )
      case 'entrenadores':
        return (
          <Coaches 
            gymSettings={gymSettings} 
            coaches={coaches} 
            onAddCoach={handleAddCoach}
            searchVal={searchVal}
          />
        )
      case 'reportes':
        return (
          <Reports 
            gymSettings={gymSettings} 
            members={members} 
            payments={payments}
            searchVal={searchVal}
          />
        )
      case 'pagos':
        return (
          <Payments 
            gymSettings={gymSettings} 
            payments={payments} 
            onAddPayment={handleAddPayment}
            searchVal={searchVal}
          />
        )
      case 'configuracion':
        return (
          <Configuration 
            gymSettings={gymSettings} 
            onSaveSettings={handleSaveSettings}
          />
        )
      case 'ayuda':
        return (
          <Help 
            gymSettings={gymSettings} 
            searchVal={searchVal}
          />
        )
      default:
        return (
          <div className="py-12 text-center text-gray-500">
            Módulo en desarrollo para {gymSettings.name} - TitanOps.
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        gymSettings={gymSettings}
        riskCount={riskCount}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          gymSettings={gymSettings} 
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          onNotificationClick={handleNotificationClick}
        />

        <main id="main-content" className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
