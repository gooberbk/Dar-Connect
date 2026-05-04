import { createClient } from '@supabase/supabase-js';

const URL = 'https://slcszbjqoxquteqvnzui.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY3N6Ympxb3hxdXRlcXZuenVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg0MDQyMiwiZXhwIjoyMDkzNDE2NDIyfQ.SYyzyQHZHxceH2exQG9n4RjPyWhNNIrwAVkIj5I_SOs';

const supabase = createClient(URL, SERVICE_KEY);

async function check() {
  const { error } = await supabase.from('reservations').select('id_card_url').limit(1);
  if (error) {
    console.log('ERREUR COLONNE:', error.message);
  } else {
    console.log('Colonne id_card_url présente !');
  }
}

check();
