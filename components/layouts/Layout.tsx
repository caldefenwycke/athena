import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-green-600 px-4 py-3">
        <h1 className="text-xl font-bold">ATHENA</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
