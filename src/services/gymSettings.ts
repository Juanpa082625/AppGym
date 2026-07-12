import { supabase } from '../lib/supabase'
import type { GymSettings } from '../types-titanops'

export async function fetchGymSettings(businessId: string): Promise<GymSettings> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single()

  if (error) throw error
  
  return {
    name: data.name,
    slug: data.slug,
    location: data.location || '',
    country: data.country || '',
    website: data.website || '',
    phone: data.phone || '',
    hours: data.hours || ''
  }
}

export async function updateGymSettings(
  businessId: string,
  settings: GymSettings
): Promise<GymSettings> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('businesses')
    .update({
      name: settings.name,
      slug: settings.slug,
      location: settings.location,
      country: settings.country,
      website: settings.website,
      phone: settings.phone,
      hours: settings.hours,
      updated_at: new Date().toISOString()
    })
    .eq('id', businessId)
    .select()
    .single()

  if (error) throw error
  
  return {
    name: data.name,
    slug: data.slug,
    location: data.location || '',
    country: data.country || '',
    website: data.website || '',
    phone: data.phone || '',
    hours: data.hours || ''
  }
}
