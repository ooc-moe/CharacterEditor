import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale });

  return {
    title: t('Metadata.title'),
    description: t('Metadata.description'),
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const ANALYTICS_SRC = process.env.NEXT_PUBLIC_ANALYTICS_SRC ?? '';
  const ANALYTICS_WEBSITE_ID = process.env.NEXT_PUBLIC_ANALYTICS_WEBSITE_ID ?? '';
  return (
    <html className="h-full" lang={locale} suppressHydrationWarning>
      <head>
        <script defer src={ANALYTICS_SRC} data-website-id={ANALYTICS_WEBSITE_ID}></script>
      </head>
      <body className="h-full antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
