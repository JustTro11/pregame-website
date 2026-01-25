import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/app/i18n/routing';
import { Outfit, Inter, Noto_Sans_TC } from 'next/font/google';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import "../globals.css";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const notoSansTc = Noto_Sans_TC({ subsets: ['latin'], weight: ['300', '400', '500', '700'], variable: '--font-chinese' });

export const metadata = {
  title: 'PreGame ★泡沫紅茶店★',
  description: 'Classic Taiwanese Tea · Modern Vibes',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${outfit.variable} ${inter.variable} ${notoSansTc.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
