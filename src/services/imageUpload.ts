import { supabase } from '../lib/supabase'

export async function uploadRoutineImage(
  file: File,
  businessId: string
): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured')

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${businessId}/${Date.now()}.${fileExt}`

  // Upload to storage
  const { data, error } = await supabase.storage
    .from('routine-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('routine-images')
    .getPublicUrl(fileName)

  return urlData.publicUrl
}

export async function deleteRoutineImage(imageUrl: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')

  // Extract filename from URL
  const urlParts = imageUrl.split('/')
  const fileName = urlParts.slice(-2).join('/')

  const { error } = await supabase.storage
    .from('routine-images')
    .remove([fileName])

  if (error) throw error
}
