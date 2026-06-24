import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
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
        <ThemeInitializer />
      </head>
      <body className="min-h-screen font-sans antialiased overflow-x-hidden">
        <UmamiProvider />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}

