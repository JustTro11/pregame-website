import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './app/i18n/request';

export default createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'as-needed', // Only show locale prefix for non-default
});

export const config = {
    // Match all pathnames except for
    // - API routes
    // - Static files
    // - Internal Next.js paths
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
