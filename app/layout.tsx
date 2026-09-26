import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { LayoutShell } from '@/components/layout/LayoutShell';
import { ThemeInitializer } from '@/components/layout/ThemeInitializer';
import { UmamiProvider } from '@/components/analytics/UmamiProvider';
import { getBaseMetadata, viewport as seoViewport } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = getBaseMetadata();
export const viewport: Viewport = seoViewport;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-1412707032084322" />
        <ThemeInitializer />
      </head>
      <body className="min-h-screen font-sans antialiased overflow-x-hidden">
        <UmamiProvider />
        <LayoutShell>{children}</LayoutShell>
      </body>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1412707032084322"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </html>
  );
}

