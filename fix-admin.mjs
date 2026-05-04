import { createClient } from '@supabase/supabase-js';

const URL = 'https://slcszbjqoxquteqvnzui.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY3N6Ympxb3hxdXRlcXZuenVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg0MDQyMiwiZXhwIjoyMDkzNDE2NDIyfQ.SYyzyQHZHxceH2exQG9n4RjPyWhNNIrwAVkIj5I_SOs';

const supabase = createClient(URL, SERVICE_KEY);

async function checkAndFixRoles() {
  console.log('Vérification des rôles...');
  
  const { data: profiles, error } = await supabase.from('profiles').select('id, email, role');
  
  if (error) {
    console.error('Erreur de lecture:', error.message);
    return;
  }
  
  console.log('Profils actuels:', profiles);
  
  const adminProfile = profiles.find(p => p.email === 'admin@test.com');
  
  if (adminProfile) {
    if (adminProfile.role !== 'admin') {
      console.log('admin@test.com est un "user". Correction vers "admin"...');
      await supabase.from('profiles').update({ role: 'admin' }).eq('id', adminProfile.id);
      console.log('Correction effectuée !');
    } else {
      console.log('admin@test.com est bien un admin !');
    }
  } else {
    console.log('admin@test.com introuvable dans la table profiles !');
  }
}

checkAndFixRoles();
