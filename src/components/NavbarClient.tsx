'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from '../navigation';
import { Home, LayoutDashboard, LogOut, User as UserIcon, Menu, X } from 'lucide-react';

interface NavbarClientProps {
  user: User | null;
  isAdmin: boolean;
}

export default function NavbarClient({ user, isAdmin }: NavbarClientProps) {
  const t = useTranslations('Index');
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100' : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Dar-Connect</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-all duration-200 shadow-sm border border-emerald-100"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full transition-all duration-200 shadow-sm border border-blue-100"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {t('myReservations')}
                  </Link>
                )}
                
                <div className="flex items-center pl-1.5 pr-4 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-default">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center mr-2 shadow-inner">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 max-w-[120px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 group"
                  title={t('logout')}
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="btn-secondary text-sm py-2 px-4"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary text-sm py-2 px-4"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="section-container py-4 flex flex-col gap-3">
            <LanguageSwitcher />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.email}</span>
                </div>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                    <LayoutDashboard className="w-4 h-4" />
                    {t('dashboard')}
                  </Link>
                )}
                {!isAdmin && (
                  <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                    <LayoutDashboard className="w-4 h-4" />
                    {t('myReservations')}
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg text-left">
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm text-center">{t('login')}</Link>
                <Link href="/signup" className="btn-primary text-sm text-center">{t('signup')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
