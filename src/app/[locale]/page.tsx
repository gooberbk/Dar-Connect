import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import PropertyCard from '@/components/PropertyCard';
import { Search, Shield, Headphones, Star, ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';

export default async function Home() {
  const t = await getTranslations('Index');
  const supabase = createClient();
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(9);

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500 opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600 opacity-10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="section-container relative z-10 py-20 md:py-28">
          {/* Badge */}
          <div className="flex justify-center mb-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-blue-200 text-sm font-medium rounded-full border border-white/20 backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
              La plateforme immobilière #1 en Algérie
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight mb-6 animate-fade-in-up stagger-1 text-balance">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-blue-200 text-center max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-2">
            {t('subtitle')}
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto animate-fade-in-up stagger-3">
            <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="w-full text-gray-900 placeholder-gray-400 bg-transparent outline-none text-base"
                />
              </div>
              <button className="btn-primary px-6 py-3 rounded-xl">
                {t('search')}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-14 animate-fade-in-up stagger-3">
            {[
              { value: t('heroStat1'), label: t('heroStat1Label') },
              { value: t('heroStat2'), label: t('heroStat2Label') },
              { value: t('heroStat3'), label: t('heroStat3Label') },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-blue-300 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1200 50 960 60 720 60C480 60 240 30 0 0L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-surface-2">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-7 h-7 text-blue-600" />,
                title: t('trustedAgents'),
                desc: t('trustedAgentsDesc'),
                color: 'bg-blue-50',
              },
              {
                icon: <Star className="w-7 h-7 text-green-600" />,
                title: t('securePay'),
                desc: t('securePayDesc'),
                color: 'bg-green-50',
              },
              {
                icon: <Headphones className="w-7 h-7 text-purple-600" />,
                title: t('support247'),
                desc: t('support247Desc'),
                color: 'bg-purple-50',
              },
            ].map((f, i) => (
              <div key={f.title} className={`card p-6 flex items-start gap-4 animate-fade-in-up stagger-${i + 1}`}>
                <div className={`w-14 h-14 ${f.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="section-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('featuredProperties')}</h2>
              <p className="text-gray-500 mt-1">{properties?.length || 0} {t('allProperties').toLowerCase()}</p>
            </div>
            <Link href="/properties" className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all">
              {t('allProperties')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, i) => (
                <div key={property.id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 3)}`}>
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
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-500 text-lg">{t('noProperties')}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
