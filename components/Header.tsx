// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-extrabold">
        <span className="text-black">ATH</span><span className="text-white">ENA</span>
      </h1>
      <nav className="flex items-center space-x-6 text-sm">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/competitions" className="hover:underline">Competitions</Link>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/support" className="hover:underline">Support</Link>
        <span className="text-black bg-white px-3 py-1 rounded">c.j.page@icloud.com</span>
        <button className="bg-black text-green-400 px-4 py-1 rounded hover:bg-gray-800">Sign Out</button>
      </nav>
    </header>
  );
}
