'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createReservation(propertyId: string, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const date = formData.get('date') as string;
  const idCardFile = formData.get('id_card') as File;

  if (!idCardFile || idCardFile.size === 0) {
    throw new Error('La carte d\'identité est requise.');
  }

  // Upload ID card to Supabase Storage and save its URL on reservation.
  const fileExt = idCardFile.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('id_cards')
    .upload(filePath, idCardFile);

  if (uploadError) {
    console.error('ID card upload error:', uploadError);
    throw new Error("Échec d'upload de la pièce d'identité.");
  }

  const { data: publicUrlData } = supabase.storage.from('id_cards').getPublicUrl(filePath);
  const idCardUrl = publicUrlData.publicUrl;

  const { error } = await supabase.from('reservations').insert({
    property_id: propertyId,
    user_id: user.id,
    date,
    id_card_url: idCardUrl,
    status: 'pending',
  });

  // Backward-compatible fallback if the DB column does not exist yet.
  if (error?.message?.toLowerCase().includes('id_card_url')) {
    const { error: fallbackError } = await supabase.from('reservations').insert({
      property_id: propertyId,
      user_id: user.id,
      date,
      status: 'pending',
    });

    if (fallbackError) {
      console.error('Reservation fallback error:', fallbackError);
      throw new Error('Erreur lors de la création de réservation.');
    }
  } else if (error) {
    console.error('Reservation error:', error);
    throw new Error('Erreur lors de la création de réservation.');
  }

  revalidatePath('/');
  redirect('/dashboard');
}
