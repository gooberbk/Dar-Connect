import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import {
  MapPin, Bed, Bath, Square, Calendar, ArrowLeft,
  CheckCircle, Clock, Shield, Star
} from 'lucide-react';
import { createReservation } from '../actions';

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
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Link>
      </div>

      <div className="section-container">
        {/* Title row */}
        <div className="mb-6 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {property.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-500">
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

        {/* Hero image - Taille réduite */}
        <div className="relative h-[250px] md:h-[350px] max-w-3xl mx-auto w-full rounded-2xl overflow-hidden mb-8 shadow-md animate-fade-in-up stagger-1">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up stagger-2">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property info bar */}
            <div className="card p-6">
              <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">{t('entireHome')}</h2>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex flex-col items-center gap-1">
                    <Bed className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-medium">3 {t('beds')}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Bath className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-medium">2 {t('baths')}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Square className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-medium">120 {t('sqft')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('description')}</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Points clés</h3>
              <div className="grid grid-cols-2 gap-3">
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

          {/* Right: Booking card */}
          <div>
            <div className="card p-6 sticky top-24">
              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {property.price.toLocaleString()} DZD
                </span>
                <span className="text-gray-500">{t('perNight')}</span>
              </div>

              {user ? (
                <form
                  action={createReservation.bind(null, property.id)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="date" className="text-sm font-semibold text-gray-700">
                      {t('selectDate')}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] text-gray-400" />
                      <input
                        type="date"
                        id="date"
                        name="date"
                        min={today}
                        required
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <label htmlFor="id_card" className="text-sm font-semibold text-gray-700">
                      Scan Carte d'Identité (PDF/Image) *
                    </label>
                    <input
                      type="file"
                      id="id_card"
                      name="id_card"
                      accept="image/*,.pdf"
                      required
                      className="input-field py-2"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full py-3.5 text-base mt-4">
                    {t('bookNow')}
                  </button>
                </form>
              ) : (
                <Link href="/login" className="btn-primary w-full py-3.5 text-base text-center block">
                  {t('loginToBook')}
                </Link>
              )}

              {/* Trust badges */}
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
    </main>
  );
}
