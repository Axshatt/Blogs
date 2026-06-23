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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap&text=abcdefghijklmnopqrstuvwxyz0123456789_"
          rel="stylesheet"
        />
        <ThemeInitializer />
      </head>
      <body className="min-h-screen font-sans antialiased overflow-x-hidden">
        <UmamiProvider />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}

