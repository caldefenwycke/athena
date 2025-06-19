'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
      <Link href="/" className="text-2xl font-bold text-green-600">
        ATH<span className="text-white">ENA</span>
      </Link>

      <nav className="flex items-center gap-6">
        {user ? (
          <>
            <Link href="/dashboard" className="text-green-500 hover:underline">
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="text-green-500 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-green-500 hover:underline">
              Sign In
            </Link>
            <Link href="/register" className="text-green-500 hover:underline">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
