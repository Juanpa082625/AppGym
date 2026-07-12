import { supabase } from '../lib/supabase'
import type { Payment } from '../types-titanops'

export async function fetchPayments(businessId: string): Promise<Payment[]> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('business_id', businessId)
    .order('payment_date', { ascending: false })

  if (error) throw error
  
  return (data || []).map(p => ({
    id: p.id,
    member: p.member_name,
    concept: p.concept,
    amount: Number(p.amount),
    method: p.method as 'Tarjeta' | 'Efectivo' | 'Transferencia',
    date: new Date(p.payment_date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    status: p.status as 'PAGADO' | 'PENDIENTE' | 'ATRASADO'
  }))
}

export async function createPayment(
  businessId: string,
  payment: Omit<Payment, 'id' | 'date'>
): Promise<Payment> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('payments')
    .insert({
      business_id: businessId,
      member_name: payment.member,
      concept: payment.concept,
      amount: payment.amount,
      method: payment.method,
      status: payment.status
    })
    .select()
    .single()

  if (error) throw error
  
  return {
    id: data.id,
    member: data.member_name,
    concept: data.concept,
    amount: Number(data.amount),
    method: data.method as 'Tarjeta' | 'Efectivo' | 'Transferencia',
    date: new Date(data.payment_date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    status: data.status as 'PAGADO' | 'PENDIENTE' | 'ATRASADO'
  }
}

export async function updatePayment(
  paymentId: string,
  updates: Partial<Omit<Payment, 'id' | 'date'>>
): Promise<Payment> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const updateData: any = {}
  if (updates.member !== undefined) updateData.member_name = updates.member
  if (updates.concept !== undefined) updateData.concept = updates.concept
  if (updates.amount !== undefined) updateData.amount = updates.amount
  if (updates.method !== undefined) updateData.method = updates.method
  if (updates.status !== undefined) updateData.status = updates.status

  const { data, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', paymentId)
    .select()
    .single()

  if (error) throw error
  
  return {
    id: data.id,
    member: data.member_name,
    concept: data.concept,
    amount: Number(data.amount),
    method: data.method as 'Tarjeta' | 'Efectivo' | 'Transferencia',
    date: new Date(data.payment_date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    status: data.status as 'PAGADO' | 'PENDIENTE' | 'ATRASADO'
  }
}

export async function deletePayment(paymentId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', paymentId)

  if (error) throw error
}
