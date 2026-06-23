'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SideDrawer } from '@/components/layout/SideDrawer';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleToggle = () => setSidebarOpen((prev) => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Header stays fixed, never shifts */}
      <Header />

      {/* Content area below navbar — this shifts when sidebar opens */}
      <div className="flex flex-1 relative">
        {/* Sidebar — sits below navbar */}
        <SideDrawer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Backdrop for mobile */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 top-[57px] bg-black/40 backdrop-blur-[2px] z-40 md:hidden cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main + Footer wrapper — shifts right only on desktop */}
        <div
          className="flex flex-1 flex-col transition-[margin-left] duration-300 ease-in-out min-w-0"
          style={{ marginLeft: sidebarOpen && !isMobile ? 260 : 0 }}
        >
          <main className="flex-1 min-w-0">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
