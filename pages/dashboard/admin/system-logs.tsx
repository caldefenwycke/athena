import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function SystemLogsPage() {
  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">System Logs</h1>
        <p className="text-gray-400">This is the system logs page. Future log tables will appear here.</p>
      </div>
    </DashboardLayout>
  );
}
