import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Users, Home, Settings, LogOut, Building2 } from 'lucide-react';
import { Link } from '@/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gray-100 flex flex-col md:flex-row overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Dar-Connect</span>
          </Link>
          <div className="mt-6">
            <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-2">Espace Admin</p>
            <p className="text-sm truncate text-blue-300">{user.email}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Tableau de bord</span>
          </Link>
          <Link href="/admin#properties" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
            <Building2 className="w-5 h-5" />
            <span className="font-medium">Propriétés</span>
          </Link>
          <Link href="/admin#reservations" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
            <Users className="w-5 h-5" />
            <span className="font-medium">Réservations / Utilisateurs</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Quitter l'Admin</span>
          </Link>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 lg:p-12 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
