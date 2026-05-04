import { createClient } from '@supabase/supabase-js';

const URL = 'https://slcszbjqoxquteqvnzui.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY3N6Ympxb3hxdXRlcXZuenVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg0MDQyMiwiZXhwIjoyMDkzNDE2NDIyfQ.SYyzyQHZHxceH2exQG9n4RjPyWhNNIrwAVkIj5I_SOs';

const supabase = createClient(URL, SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seed() {
  console.log('Seeding dummy users...');

  // 1. Create Admin
  console.log('Creating admin user...');
  const { data: adminData, error: adminErr } = await supabase.auth.admin.createUser({
    email: 'admin@test.com',
    password: 'password123',
    email_confirm: true
  });
  
  if (adminErr) {
    console.error('Error creating admin:', adminErr.message);
  } else {
    // Make them admin in profiles
    await supabase.from('profiles').update({ role: 'admin' }).eq('id', adminData.user.id);
    console.log('Admin created: admin@test.com / password123');
  }

  // 2. Create standard User
  console.log('Creating standard user...');
  const { data: userData, error: userErr } = await supabase.auth.admin.createUser({
    email: 'user@test.com',
    password: 'password123',
    email_confirm: true
  });
  
  if (userErr) {
    console.error('Error creating user:', userErr.message);
  } else {
    console.log('User created: user@test.com / password123');
  }

  // 3. Seed some dummy properties
  console.log('Seeding dummy properties...');
  const properties = [
    {
      title: 'Villa Moderne avec Piscine',
      description: 'Superbe villa avec vue sur la mer. Piscine chauffée, 4 chambres, jardin spacieux.',
      price: 15000,
      location: 'Oran, Algérie',
      images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800']
    },
    {
      title: 'Appartement Haut Standing',
      description: 'Appartement F4 luxueux en plein centre ville. Parking sous-terrain, sécurité 24/7.',
      price: 8000,
      location: 'Alger Centre',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800']
    },
    {
      title: 'Maison Traditionnelle',
      description: 'Belle maison de style mauresque, patio intérieur, idéale pour les familles.',
      price: 6000,
      location: 'Tlemcen',
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800']
    }
  ];

  for (const prop of properties) {
    const { error: propErr } = await supabase.from('properties').insert(prop);
    if (propErr) console.error('Error inserting property:', propErr.message);
  }
  console.log('Dummy properties added!');
  console.log('Done!');
}

seed();
