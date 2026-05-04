import { createClient } from '@supabase/supabase-js';

const URL = 'https://slcszbjqoxquteqvnzui.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY3N6Ympxb3hxdXRlcXZuenVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg0MDQyMiwiZXhwIjoyMDkzNDE2NDIyfQ.SYyzyQHZHxceH2exQG9n4RjPyWhNNIrwAVkIj5I_SOs';

const supabase = createClient(URL, SERVICE_KEY);

async function setup() {
  console.log('Création du bucket id_cards...');
  const { data, error } = await supabase.storage.createBucket('id_cards', {
    public: true,
    fileSizeLimit: 10485760, // 10MB
  });
  
  if (error) {
    console.error('Erreur bucket (peut-être existe-t-il déjà):', error.message);
  } else {
    console.log('Bucket id_cards créé avec succès !');
  }
}

setup();
