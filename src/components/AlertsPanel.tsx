import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, CreditCard, UserX, TrendingDown } from 'lucide-react'
import type { Alert, AlertType, AlertCategory } from '../services/alerts'

interface AlertsPanelProps {
  alerts: Alert[]
  onAlertClick?: (alert: Alert) => void
}

export default function AlertsPanel({ alerts, onAlertClick }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-white border border-[#EFE9E4] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900 mb-1">Todo en orden</h3>
            <p className="text-xs text-gray-500">No hay alertas pendientes</p>
          </div>
        </div>
      </div>
    )
  }

  const getAlertIcon = (type: AlertType, category: AlertCategory) => {
    if (category === 'membership_expiring' || category === 'membership_expired') {
      return <Clock className="w-4 h-4" />
    }
    if (category === 'inactive_member') {
      return <UserX className="w-4 h-4" />
    }
    if (category === 'payment_pending') {
      return <CreditCard className="w-4 h-4" />
    }
    if (category === 'high_risk') {
      return <TrendingDown className="w-4 h-4" />
    }
    
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-4 h-4" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />
      case 'info':
        return <Info className="w-4 h-4" />
      case 'success':
        return <CheckCircle className="w-4 h-4" />
    }
  }

  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900'
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-900'
    }
  }

  const getIconStyles = (type: AlertType) => {
    switch (type) {
      case 'danger':
        return 'text-red-600'
      case 'warning':
        return 'text-amber-600'
      case 'info':
        return 'text-blue-600'
      case 'success':
        return 'text-emerald-600'
    }
  }

  return (
    <div className="bg-white border border-[#EFE9E4] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900">Alertas y Notificaciones</h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {alerts.length} alerta{alerts.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alerts.slice(0, 10).map((alert) => (
          <div
            key={alert.id}
            onClick={() => onAlertClick?.(alert)}
            className={`
              border rounded-xl p-3 cursor-pointer transition-all hover:shadow-md
              ${getAlertStyles(alert.type)}
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 mt-0.5 ${getIconStyles(alert.type)}`}>
                {getAlertIcon(alert.type, alert.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs font-bold truncate">{alert.title}</h4>
                  {alert.actionLabel && (
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 flex-shrink-0">
                      {alert.actionLabel}
                    </span>
                  )}
                </div>
                <p className="text-[11px] opacity-80">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length > 10 && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-500">
            Mostrando 10 de {alerts.length} alertas
          </p>
        </div>
      )}
    </div>
  )
}
