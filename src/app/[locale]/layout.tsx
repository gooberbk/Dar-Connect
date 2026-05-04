import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata: Metadata = {
  title: 'Dar-Connect — Plateforme immobilière',
  description: 'Trouvez la propriété de vos rêves en Algérie. Milliers de logements, villas et appartements disponibles.',
  keywords: 'immobilier, Algérie, location, villa, appartement, dar-connect',
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClass = locale === 'ar' ? cairo.className : inter.className;

  return (
    <html lang={locale} dir={dir}>
      <body className={`${fontClass} min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
            <div className="section-container flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-400">
              <span>© 2024 Dar-Connect. Tous droits réservés.</span>
              <span>Développé avec Next.js · Supabase · Vercel</span>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
