'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center border-b border-green-600">
      <Link href="/" className="text-2xl font-bold">
        <span className="text-green-500">ATH</span>
        <span className="text-white">ENA</span>
      </Link>

      <nav className="flex items-center gap-6 text-sm font-medium">
        <Link href="/" className="hover:text-green-400">
          Home
        </Link>
        <Link href="/competitions" className="hover:text-green-400">
          Competitions
        </Link>
        <Link href="/dashboard" className="hover:text-green-400">
          Dashboard
        </Link>
        <Link href="/support" className="hover:text-green-400">
          Support
        </Link>

        {user ? (
          <button onClick={logout} className="hover:text-green-400">
            Logout
          </button>
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
