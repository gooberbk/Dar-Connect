import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['fr', 'ar'] as const;

export default getRequestConfig(async ({locale}) => {
  if (!locale || !locales.includes(locale as (typeof locales)[number])) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
