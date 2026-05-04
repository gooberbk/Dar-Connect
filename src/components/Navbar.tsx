import { createClient } from '@/utils/supabase/server';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    isAdmin = profile?.role === 'admin';
    console.log('DEBUG NAVBAR:', { userId: user.id, profileRole: profile?.role, isAdmin, error });
  }

  return <NavbarClient user={user} isAdmin={isAdmin} />;
}
