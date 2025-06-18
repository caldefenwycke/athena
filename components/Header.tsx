// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-black text-white border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo (left-aligned with no side padding) */}
        <Link href="/" className="text-3xl font-extrabold tracking-wide">
          <span className="text-[#00FF00]">ATH</span>
          <span className="text-white">ENA</span>
        </Link>

        {/* Navigation menu */}
        <nav className="flex items-center space-x-8 text-[16px] font-medium">
          <Link href="/" className="hover:text-[#00FF00] transition-colors">Home</Link>
          <Link href="/competitions" className="hover:text-[#00FF00] transition-colors">Competitions</Link>
          <Link href="/dashboard" className="hover:text-[#00FF00] transition-colors">Dashboard</Link>
          <Link href="/support" className="hover:text-[#00FF00] transition-colors">Support</Link>
          <Link
            href="/account/signin"
            className="ml-4 px-4 py-2 bg-[#00FF00] text-black rounded hover:bg-[#00DD00] font-bold transition-colors"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
