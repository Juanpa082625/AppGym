import type { Member, Payment } from '../types-titanops'

export type AlertType = 'warning' | 'danger' | 'info' | 'success'
export type AlertCategory = 
  | 'membership_expiring'
  | 'membership_expired'
  | 'inactive_member'
  | 'payment_pending'
  | 'high_risk'

export interface Alert {
  id: string
  type: AlertType
  category: AlertCategory
  title: string
  message: string
  memberId?: string
  memberName?: string
  timestamp: Date
  actionLabel?: string
  actionUrl?: string
}

// Generate alerts based on members and payments data
export function generateAlerts(members: Member[], payments: Payment[]): Alert[] {
  const alerts: Alert[] = []
  const now = new Date()

  // 1. Membership expiring in next 7 days
  members.forEach(member => {
    if (member.membershipStatus === 'PROXIMA_A_VENCER' && member.daysUntilExpiry !== undefined) {
      alerts.push({
        id: `expiring-${member.id}`,
        type: 'warning',
        category: 'membership_expiring',
        title: 'Membresía por vencer',
        message: `${member.name} - Vence en ${member.daysUntilExpiry} día${member.daysUntilExpiry !== 1 ? 's' : ''}`,
        memberId: member.id,
        memberName: member.name,
        timestamp: now,
        actionLabel: 'Renovar',
        actionUrl: `/members/${member.id}`
      })
    }
  })

  // 2. Membership expired
  members.forEach(member => {
    if (member.membershipStatus === 'VENCIDA' || member.membershipStatus === 'VENCE_HOY') {
      alerts.push({
        id: `expired-${member.id}`,
        type: 'danger',
        category: 'membership_expired',
        title: member.membershipStatus === 'VENCE_HOY' ? 'Membresía vence hoy' : 'Membresía vencida',
        message: `${member.name} - ${member.membershipStatus === 'VENCE_HOY' ? 'Requiere renovación inmediata' : `Venció hace ${Math.abs(member.daysUntilExpiry || 0)} día${Math.abs(member.daysUntilExpiry || 0) !== 1 ? 's' : ''}`}`,
        memberId: member.id,
        memberName: member.name,
        timestamp: now,
        actionLabel: 'Renovar',
        actionUrl: `/members/${member.id}`
      })
    }
  })

  // 3. Inactive members (no visit in last 14 days)
  members.forEach(member => {
    if (member.lastVisit && member.lastVisit.includes('hace')) {
      const daysMatch = member.lastVisit.match(/hace (\d+)/)
      if (daysMatch) {
        const days = parseInt(daysMatch[1])
        if (days >= 14) {
          alerts.push({
            id: `inactive-${member.id}`,
            type: 'warning',
            category: 'inactive_member',
            title: 'Miembro inactivo',
            message: `${member.name} - No asiste hace ${days} días`,
            memberId: member.id,
            memberName: member.name,
            timestamp: now,
            actionLabel: 'Contactar',
            actionUrl: `/members/${member.id}`
          })
        }
      }
    }
  })

  // 4. Pending payments
  payments.forEach(payment => {
    if (payment.status === 'PENDIENTE' || payment.status === 'ATRASADO') {
      alerts.push({
        id: `payment-${payment.id}`,
        type: payment.status === 'ATRASADO' ? 'danger' : 'warning',
        category: 'payment_pending',
        title: payment.status === 'ATRASADO' ? 'Pago atrasado' : 'Pago pendiente',
        message: `${payment.member} - ${payment.concept} ($${payment.amount})`,
        timestamp: now,
        actionLabel: 'Ver pago',
        actionUrl: `/payments/${payment.id}`
      })
    }
  })

  // 5. High risk members
  members.forEach(member => {
    if (member.risk === 'ALTO') {
      alerts.push({
        id: `risk-${member.id}`,
        type: 'danger',
        category: 'high_risk',
        title: 'Alto riesgo de abandono',
        message: `${member.name} - Score: ${member.riskScore}/100`,
        memberId: member.id,
        memberName: member.name,
        timestamp: now,
        actionLabel: 'Ver detalles',
        actionUrl: `/members/${member.id}`
      })
    }
  })

  // Sort by priority: danger > warning > info > success
  const priority = { danger: 0, warning: 1, info: 2, success: 3 }
  alerts.sort((a, b) => priority[a.type] - priority[b.type])

  return alerts
}

// Get alert summary counts
export function getAlertSummary(alerts: Alert[]) {
  return {
    total: alerts.length,
    danger: alerts.filter(a => a.type === 'danger').length,
    warning: alerts.filter(a => a.type === 'warning').length,
    info: alerts.filter(a => a.type === 'info').length,
    success: alerts.filter(a => a.type === 'success').length
  }
}
