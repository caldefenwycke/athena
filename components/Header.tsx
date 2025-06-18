// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-black border-b border-[#1A1A1A] px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          <span className="text-[#00FF00]">ATH</span>ENA
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-white hover:text-[#00FF00]">Home</Link>
          <Link href="/competitions" className="text-white hover:text-[#00FF00]">Competitions</Link>
          <Link href="/dashboard" className="text-white hover:text-[#00FF00]">Dashboard</Link>
          <Link href="/support" className="text-white hover:text-[#00FF00]">Support</Link>
          <Link href="/account/signin" className="px-4 py-1 bg-[#00FF00] text-black font-semibold rounded hover:bg-[#00DD00]">Sign In</Link>
        </nav>
      </div>
    </header>
  );
}
