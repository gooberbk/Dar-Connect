import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import PropertyCard from '@/components/PropertyCard';
import { Search } from 'lucide-react';

export default async function AllPropertiesPage() {
  const t = await getTranslations('Index');
  const supabase = createClient();
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="flex-grow bg-gray-50 py-12">
      <div className="section-container">
        <div className="mb-10 text-center animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('allProperties')}</h1>
          <p className="text-gray-500 text-lg">
            Découvrez notre sélection complète de logements disponibles.
          </p>
        </div>

        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property, i) => (
              <div key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <PropertyCard
                  id={property.id}
                  title={property.title}
                  price={property.price}
                  location={property.location}
                  imageUrl={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">{t('noProperties')}</p>
          </div>
        )}
      </div>
    </main>
  );
}
