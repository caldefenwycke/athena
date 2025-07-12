'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/context/AuthContext';
import { useState } from 'react';
import AuthModal from '@/components/ui/AuthModal';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { pathname } = useRouter();

  if (loading) return null;

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      <header className="bg-black text-white border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
          {/* Logo */}
          <Link href="/" className="text-4xl font-normal tracking-wide">
            <span className="text-[#00FF00]">ATH</span>
            <span className="text-white">ENA</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-10 text-[20px] font-normal">
            <Link
              href="/"
              className={`transition-colors ${isActive('/') ? 'text-[#00FF00]' : 'hover:text-[#00FF00]'}`}
            >
              Home
            </Link>
            <Link
              href="/competitions"
              className={`transition-colors ${isActive('/competitions') ? 'text-[#00FF00]' : 'hover:text-[#00FF00]'}`}
            >
              Competitions
            </Link>
            <Link
              href="/dashboard"
              className={`transition-colors ${isActive('/dashboard') ? 'text-[#00FF00]' : 'hover:text-[#00FF00]'}`}
            >
              Dashboard
            </Link>
            <Link
              href="/sponsorship"
              className={`transition-colors ${isActive('/sponsorship') ? 'text-[#00FF00]' : 'hover:text-[#00FF00]'}`}
            >
              Sponsorship
            </Link>
            <Link
              href="/pricing"
              className={`transition-colors ${isActive('/pricing') ? 'text-[#00FF00]' : 'hover:text-[#00FF00]'}`}
            >
              Pricing
            </Link>
            <Link
              href="/support"
              className={`transition-colors ${isActive('/support') ? 'text-[#00FF00]' : 'hover:text-[#00FF00]'}`}
            >
              Support
            </Link>

            {user ? (
              <>
                <span className="text-[#00FF00]">{user.displayName || user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="hover:text-[#00FF00] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className={`transition-colors ${authModalOpen ? 'text-[#00FF00]' : 'text-white hover:text-[#00FF00]'}`}
              >
                Login / Register
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
