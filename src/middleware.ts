import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';
import { routing } from './navigation';

const handleI18nRouting = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  return await updateSession(request, response);
}

export const config = {
  matcher: ['/', '/(fr|ar)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
