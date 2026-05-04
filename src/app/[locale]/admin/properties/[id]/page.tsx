import { createClient } from '@/utils/supabase/server';
import { updateProperty } from '../../actions';
import { notFound, redirect } from 'next/navigation';
import { Link } from '@/navigation';
import { ArrowLeft, Save, Building2 } from 'lucide-react';

export default async function EditPropertyPage({
  params: { id }
}: {
  params: { id: string }
}) {
  const supabase = createClient();
  const { data: property, error } = await supabase.from('properties').select('*').eq('id', id).single();

  if (error || !property) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour au tableau de bord
      </Link>

      <section className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Modifier la propriété</h2>
        </div>

        <form action={async (formData) => {
          'use server';
          await updateProperty(id, formData);
          redirect('/admin');
        }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Titre *</label>
            <input
              name="title"
              defaultValue={property.title}
              required
              className="input-field"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Prix (DZD/nuit) *</label>
            <input
              name="price"
              type="number"
              defaultValue={property.price}
              required
              className="input-field"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Localisation *</label>
            <input
              name="location"
              defaultValue={property.location}
              required
              className="input-field"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">URL de l'image (Laissez vide pour conserver l'actuelle)</label>
            <input
              name="imageUrl"
              defaultValue={property.images?.[0] || ''}
              className="input-field"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              defaultValue={property.description}
              required
              className="input-field h-32 resize-none"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <Link href="/admin" className="btn-secondary">
              Annuler
            </Link>
            <button type="submit" className="btn-primary">
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
