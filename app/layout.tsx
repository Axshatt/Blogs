import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LayoutShell } from '@/components/layout/LayoutShell';
import { ThemeInitializer } from '@/components/layout/ThemeInitializer';
import { getBaseMetadata, viewport as seoViewport } from '@/lib/seo';

export const metadata: Metadata = getBaseMetadata();
export const viewport: Viewport = seoViewport;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <ThemeInitializer />
      </head>
      <body className="min-h-screen font-sans antialiased overflow-x-hidden">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
