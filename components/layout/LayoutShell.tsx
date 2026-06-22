'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SideDrawer } from '@/components/layout/SideDrawer';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setSidebarOpen((prev) => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Header stays fixed, never shifts */}
      <Header />

      {/* Content area below navbar — this shifts when sidebar opens */}
      <div className="flex flex-1 relative">
        {/* Sidebar — sits below navbar */}
        <SideDrawer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main + Footer wrapper — shifts right */}
        <div
          className="flex flex-1 flex-col transition-[margin-left] duration-300 ease-in-out"
          style={{ marginLeft: sidebarOpen ? 260 : 0 }}
        >
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
