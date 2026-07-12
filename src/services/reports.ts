import { supabase } from '../lib/supabase'

export interface Report {
  id: string
  title: string
  type: 'MENSUAL' | 'COHORTE'
  membersCount: number
  date: string
}

export async function fetchReports(businessId: string): Promise<Report[]> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('business_id', businessId)
    .order('generated_date', { ascending: false })

  if (error) throw error
  
  return (data || []).map(r => ({
    id: r.id,
    title: r.title,
    type: r.type as 'MENSUAL' | 'COHORTE',
    membersCount: r.members_count,
    date: `generado ${new Date(r.generated_date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })}`
  }))
}

export async function createReport(
  businessId: string,
  report: Omit<Report, 'id' | 'date'>
): Promise<Report> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('reports')
    .insert({
      business_id: businessId,
      title: report.title,
      type: report.type,
      members_count: report.membersCount
    })
    .select()
    .single()

  if (error) throw error
  
  return {
    id: data.id,
    title: data.title,
    type: data.type as 'MENSUAL' | 'COHORTE',
    membersCount: data.members_count,
    date: `generado ${new Date(data.generated_date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })}`
  }
}

export async function deleteReport(reportId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', reportId)

  if (error) throw error
}
