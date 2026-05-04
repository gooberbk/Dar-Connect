import { createClient } from '@/utils/supabase/server';
import { addProperty, deleteProperty, updateReservationStatus } from './actions';
import { Link } from '@/navigation';
import {
  Trash2, CheckCircle, XCircle, PlusCircle,
  Building2, CalendarCheck, TrendingUp, Users, Pencil
} from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ data: properties }, { data: reservations }] = await Promise.all([
    supabase.from('properties').select('*').order('created_at', { ascending: false }),
    supabase
      .from('reservations')
      .select(`*, profiles(email), properties(title)`)
      .order('created_at', { ascending: false }),
  ]);

  const pendingCount = reservations?.filter(r => r.status === 'pending').length ?? 0;
  const confirmedCount = reservations?.filter(r => r.status === 'confirmed').length ?? 0;

  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Propriétés',
            value: properties?.length ?? 0,
            icon: <Building2 className="w-5 h-5 text-blue-600" />,
            bg: 'bg-blue-50',
            color: 'text-blue-600',
          },
          {
            label: 'Réservations',
            value: reservations?.length ?? 0,
            icon: <CalendarCheck className="w-5 h-5 text-purple-600" />,
            bg: 'bg-purple-50',
            color: 'text-purple-600',
          },
          {
            label: 'En attente',
            value: pendingCount,
            icon: <TrendingUp className="w-5 h-5 text-yellow-600" />,
            bg: 'bg-yellow-50',
            color: 'text-yellow-600',
          },
          {
            label: 'Confirmées',
            value: confirmedCount,
            icon: <Users className="w-5 h-5 text-green-600" />,
            bg: 'bg-green-50',
            color: 'text-green-600',
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add property form */}
      <section className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Ajouter une propriété</h2>
        </div>

        <form action={addProperty} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Titre *</label>
            <input
              name="title"
              placeholder="Ex: Villa moderne à Alger"
              required
              className="input-field"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Prix (DZD/nuit) *</label>
            <input
              name="price"
              type="number"
              placeholder="Ex: 5000"
              required
              className="input-field"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Localisation *</label>
            <input
              name="location"
              placeholder="Ex: Hydra, Alger"
              required
              className="input-field"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">URL de l'image</label>
            <input
              name="imageUrl"
              placeholder="https://..."
              className="input-field"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              placeholder="Décrivez la propriété..."
              required
              className="input-field h-28 resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary">
              <PlusCircle className="w-4 h-4" />
              Ajouter la propriété
            </button>
          </div>
        </form>
      </section>

      {/* Properties table */}
      <section id="properties" className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            Propriétés ({properties?.length ?? 0})
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-3 px-4 font-semibold text-gray-600">Titre</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Localisation</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Prix / nuit</th>
                <th className="py-3 px-4 font-semibold text-gray-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {properties?.map((prop) => (
                <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{prop.title}</td>
                  <td className="py-3 px-4 text-gray-500">{prop.location}</td>
                  <td className="py-3 px-4 font-semibold text-blue-600">
                    {prop.price.toLocaleString()} DZD
                  </td>
                  <td className="py-3 px-4 text-right flex justify-end gap-2">
                    <Link
                      href={`/admin/properties/${prop.id}`}
                      className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg text-sm transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                      Modifier
                    </Link>
                    <form action={deleteProperty.bind(null, prop.id)}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg text-sm transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!properties || properties.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400">
                    Aucune propriété. Ajoutez-en une ci-dessus.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reservations table */}
      <section id="reservations" className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            Réservations ({reservations?.length ?? 0})
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-3 px-4 font-semibold text-gray-600">Propriété</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Utilisateur</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Date</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Statut</th>
                <th className="py-3 px-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reservations?.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {res.properties?.title ?? '—'}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {res.profiles?.email ?? '—'}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(res.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${
                      res.status === 'confirmed' ? 'badge-confirmed' :
                      res.status === 'cancelled' ? 'badge-cancelled' :
                      'badge-pending'
                    }`}>
                      {res.status === 'confirmed' ? 'Confirmé' :
                       res.status === 'cancelled' ? 'Annulé' : 'En attente'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {res.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <form action={updateReservationStatus.bind(null, res.id, 'confirmed')}>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 text-green-600 hover:bg-green-50 px-2.5 py-1.5 rounded-lg text-sm transition-colors"
                            title="Confirmer"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirmer
                          </button>
                        </form>
                        <form action={updateReservationStatus.bind(null, res.id, 'cancelled')}>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg text-sm transition-colors"
                            title="Annuler"
                          >
                            <XCircle className="w-4 h-4" />
                            Annuler
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {(!reservations || reservations.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    Aucune réservation pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
