// pages/dashboard/index.tsx
import Header from '@/components/Header';
import Sidebar from '@/components/DashboardSidebar';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold mb-4">DASHBOARD</h1>
          <p className="text-gray-400">Loading...</p>
        </main>
      </div>
    </div>
  );
}
