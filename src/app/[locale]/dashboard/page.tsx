import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Home, CalendarCheck } from 'lucide-react';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export default async function UserDashboard() {
  const supabase = createClient();
  const t = await getTranslations('Index');

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user reservations with property details
  const { data: reservations } = await supabase
    .from('reservations')
    .select(`
      *,
      properties (
        title,
        location,
        images,
        price
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="section-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{t('myReservations')}</h1>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="section-container py-8">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Historique de vos réservations ({reservations?.length ?? 0})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reservations && reservations.length > 0 ? (
              reservations.map((res: any) => (
                <div key={res.id} className="border border-gray-100 rounded-xl p-4 flex gap-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  {/* Property Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={res.properties?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=200'}
                      alt={res.properties?.title || 'Property'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{res.properties?.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{res.properties?.location}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm font-medium text-gray-700">
                        {new Date(res.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <span className={`badge ${
                        res.status === 'confirmed' ? 'badge-confirmed' :
                        res.status === 'cancelled' ? 'badge-cancelled' :
                        'badge-pending'
                      }`}>
                        {res.status === 'confirmed' ? 'Confirmé' :
                         res.status === 'cancelled' ? 'Annulé' : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                Vous n'avez aucune réservation pour le moment.
                <div className="mt-4">
                  <Link href="/properties" className="btn-primary">
                    Explorer les propriétés
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
