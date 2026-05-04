import { createClient } from '@supabase/supabase-js';

const URL = 'https://slcszbjqoxquteqvnzui.supabase.co';
// USING ANON KEY, NOT SERVICE KEY, SO RLS APPLIES!
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY3N6Ympxb3hxdXRlcXZuenVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NDA0MjIsImV4cCI6MjA5MzQxNjQyMn0.1r0xEx0BKMPi0N8OqoXm2vsfzV1c-0zRzg72PIu8wsM';

const supabase = createClient(URL, ANON_KEY);

async function testRLS() {
  console.log('Connexion avec admin@test.com...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@test.com',
    password: 'password123'
  });
  
  if (authError) {
    console.error('Erreur auth:', authError.message);
    return;
  }
  
  const userId = authData.user.id;
  console.log('Connecté ! User ID:', userId);
  
  console.log('Recherche du profil (avec RLS)...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
    
  if (profileError) {
    console.error('Erreur lors de la récupération du profil:', profileError);
  } else {
    console.log('Profil récupéré avec succès:', profile);
  }
}

testRLS();
