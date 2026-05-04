'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '../navigation';
import { ChangeEvent } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <select
        defaultValue={locale}
        onChange={onChange}
        className="bg-transparent text-sm font-medium text-gray-700 cursor-pointer focus:outline-none"
      >
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}
