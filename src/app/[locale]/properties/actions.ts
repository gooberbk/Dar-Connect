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

  // Upload file to Supabase Storage (ignoring errors as requested)
  const fileExt = idCardFile.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;

  await supabase.storage
    .from('id_cards')
    .upload(fileName, idCardFile)
    .catch(() => {
      // Ignore upload errors silently
    });

  // We insert into reservations WITHOUT id_card_url to avoid DB schema crash
  const { error } = await supabase.from('reservations').insert({
    property_id: propertyId,
    user_id: user.id,
    date,
    status: 'pending',
  });

  if (error) {
    console.error('Reservation error:', error);
  }

  revalidatePath('/');
  redirect('/dashboard');
}
