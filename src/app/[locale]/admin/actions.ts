'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProperty(formData: FormData) {
  const supabase = createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const location = formData.get('location') as string
  const imageUrl = formData.get('imageUrl') as string
  
  const { error } = await supabase.from('properties').insert({
    title,
    description,
    price,
    location,
    images: imageUrl ? [imageUrl] : []
  })

  if (!error) {
    revalidatePath('/', 'layout')
  }
}

export async function deleteProperty(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('properties').delete().eq('id', id)
  
  if (!error) {
    revalidatePath('/', 'layout')
  }
}

export async function updateReservationStatus(id: string, status: string) {
  const supabase = createClient()
  const { error } = await supabase.from('reservations').update({ status }).eq('id', id)
  
  if (!error) {
    revalidatePath('/', 'layout')
  }
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const location = formData.get('location') as string
  const imageUrl = formData.get('imageUrl') as string
  
  const updates: any = {
    title,
    description,
    price,
    location,
  }
  
  if (imageUrl) {
    updates.images = [imageUrl]
  }

  const { error } = await supabase.from('properties').update(updates).eq('id', id)

  if (!error) {
    revalidatePath('/', 'layout')
  }
}
