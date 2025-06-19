// components/layouts/DashboardLayout.tsx
import React from 'react';
import DashboardSidebar from '../DashboardSidebar'; // ✅ Correct relative path

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
