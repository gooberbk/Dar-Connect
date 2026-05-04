import { login } from '../auth-actions';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { Mail, Lock, Home, ArrowRight } from 'lucide-react';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const t = await getTranslations('Auth');
  const tIndex = await getTranslations('Index');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <Home className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('loginTitle')}</h1>
            <p className="text-gray-500 mt-1 text-sm">{t('loginSubtitle')}</p>
          </div>

          {/* Error message */}
          {searchParams?.message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
              <span className="text-red-500">⚠</span>
              {searchParams.message}
            </div>
          )}

          {/* Form */}
          <form action={login} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700" htmlFor="email">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 w-[18px]" />
                <input
                  id="email"
                  className="input-field pl-10"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700" htmlFor="password">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-[18px]" />
                <input
                  id="password"
                  className="input-field pl-10"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3 mt-2 group">
              {t('signIn')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {t('noAccount')}{' '}
            <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
              {tIndex('signup')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
