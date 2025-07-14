import { ReactNode } from 'react';
import Header from './Header';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header /> {/* ✅ Always include header */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {children}
      </main>
    </div>
  );
}
