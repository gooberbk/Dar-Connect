import { signup } from '../auth-actions';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { Mail, Lock, Home, ArrowRight } from 'lucide-react';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const t = await getTranslations('Auth');
  const tIndex = await getTranslations('Index');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
              <Home className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('signupTitle')}</h1>
            <p className="text-gray-500 mt-1 text-sm">{t('signupSubtitle')}</p>
          </div>

          {/* Message */}
          {searchParams?.message && (
            <div className={`mb-6 p-4 text-sm rounded-xl flex items-center gap-2 border ${
              searchParams.message.toLowerCase().includes('check') || searchParams.message.toLowerCase().includes('email')
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <span>{searchParams.message.toLowerCase().includes('check') ? '✅' : '⚠'}</span>
              {searchParams.message}
            </div>
          )}

          {/* Form */}
          <form action={signup} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700" htmlFor="email">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-[18px]" />
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
                  minLength={6}
                  required
                />
              </div>
              <p className="text-xs text-gray-400">Minimum 6 caractères</p>
            </div>

            <button type="submit" className="btn-primary w-full py-3 mt-2 group">
              {t('signUp')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {t('hasAccount')}{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
              {tIndex('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
