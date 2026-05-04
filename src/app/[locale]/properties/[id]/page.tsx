import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import {
  MapPin, Bed, Bath, Square, ArrowLeft,
  CheckCircle, Clock, Shield, Star
} from 'lucide-react';
import BookingForm from '@/components/BookingForm';

export default async function PropertyDetailsPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string }
}) {
  const supabase = createClient();

  const [{ data: property, error }, { data: { user } }, t, tIndex] = await Promise.all([
    supabase.from('properties').select('*').eq('id', id).single(),
    supabase.auth.getUser(),
    getTranslations('Property'),
    getTranslations('Index'),
  ]);

  if (error || !property) {
    notFound();
  }

  const mainImage =
    property.images?.[0] ||
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200';

  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Back button */}
      <div className="section-container pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm active:scale-95 transition-all duration-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Link>
      </div>

      <div className="section-container">
        {/* Above-the-fold: image left / info right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in-up">
          <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[440px] rounded-3xl overflow-hidden shadow-xl bg-gray-100">
            <Image
              src={mainImage}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-gray-500 ml-1">(4.9)</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {property.price.toLocaleString()} DZD
                  </span>
                  <span className="text-gray-500">{t('perNight')}</span>
                </div>
                <div className="text-sm font-semibold text-gray-600">{t('entireHome')}</div>
              </div>

              <div className="mt-5 flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">3 {t('beds')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">2 {t('baths')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">120 {t('sqft')}</span>
                </div>
              </div>

              <div className="mt-6">
                {user ? (
                  <BookingForm
                    propertyId={property.id}
                    today={today}
                    t_selectDate={t('selectDate')}
                    t_bookNow={t('bookNow')}
                  />
                ) : (
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 mt-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-200/50 transition-all duration-200"
                  >
                    {t('loginToBook')}
                  </Link>
                )}

                <div className="mt-5 pt-5 border-t border-gray-100 space-y-2.5">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4 text-green-500" />
                    Paiement 100% sécurisé
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Confirmation en moins de 24h
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Annulation gratuite sous 48h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up stagger-1">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('description')}</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Points clés</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Wi-Fi inclus',
                  'Parking gratuit',
                  'Cuisine équipée',
                  'Climatisation',
                  'Sécurité 24/7',
                  'Vue panoramique',
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>
    </main>
  );
}
