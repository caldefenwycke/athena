'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface LogEntry {
  id: string;
  action: string;
  performedBy: string;
  performedByEmail?: string;
  targetUser?: string;
  targetUserEmail?: string;
  competitionId?: string;
  details?: string;
  timestamp?: any;
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  useEffect(() => {
    const fetchLogs = async () => {
      const q = query(collection(db, 'systemLogs'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<LogEntry, 'id'>),
      }));

      // Map user UIDs to emails
      const userUids = new Set<string>();
      data.forEach((log) => {
        if (log.performedBy) userUids.add(log.performedBy);
        if (log.targetUser) userUids.add(log.targetUser);
      });

      const userMap: Record<string, string> = {};
      await Promise.all(
        Array.from(userUids).map(async (uid) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              userMap[uid] = userData.email || '(unknown)';
            }
          } catch (error) {
            console.error(`Failed to fetch user for UID ${uid}`, error);
          }
        })
      );

      const logsWithEmails = data.map((log) => ({
        ...log,
        performedByEmail: userMap[log.performedBy] || log.performedBy,
        targetUserEmail: log.targetUser ? userMap[log.targetUser] || log.targetUser : '',
      }));

      setLogs(logsWithEmails);
    };

    fetchLogs();
  }, []);

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action))).filter(Boolean);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.performedByEmail && log.performedByEmail.toLowerCase().includes(search.toLowerCase())) ||
      (log.targetUserEmail && log.targetUserEmail.toLowerCase().includes(search.toLowerCase())) ||
      (log.competitionId && log.competitionId.toLowerCase().includes(search.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(search.toLowerCase()));

    const matchesAction = actionFilter === 'All' || log.action === actionFilter;

    const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : null;
    const startFilter = startDate ? new Date(startDate) <= logDate : true;
    const endFilter = endDate ? logDate <= new Date(endDate) : true;

    return matchesSearch && matchesAction && startFilter && endFilter;
  });

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Action', 'Performed By', 'Target User', 'Competition ID', 'Details'];
    const rows = filteredLogs.map((log) => [
      log.timestamp?.toDate ? log.timestamp.toDate().toISOString() : '',
      log.action,
      log.performedByEmail || '',
      log.targetUserEmail || '',
      log.competitionId || '',
      log.details || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'system_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-4">System Logs</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 rounded bg-[#222] text-white border border-[#333]"
          />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="p-2 rounded bg-[#222] text-white border border-[#333]"
          >
            <option value="All">All Actions</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div>
            <label className="block text-white mb-1">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 rounded bg-[#222] text-white border border-[#333]"
            />
          </div>
          <div>
            <label className="block text-white mb-1">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 rounded bg-[#222] text-white border border-[#333]"
            />
          </div>
        </div>

        <button
          onClick={exportToCSV}
          className="bg-[#00FF00] text-black px-4 py-2 rounded font-bold mb-4 hover:bg-[#00e600]"
        >
          Export Logs to CSV
        </button>

        {/* Logs Table */}
        <div className="w-full overflow-x-auto border border-[#333] rounded">
          <div style={{ minWidth: '1100px' }}>
            <table className="table-auto text-sm">
              <thead>
                <tr className="text-[#00FF00] border-b border-[#333]">
                  <th className="px-4 py-2">Timestamp</th>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Performed By</th>
                  <th className="px-4 py-2">Target User</th>
                  <th className="px-4 py-2">Competition</th>
                  <th className="px-4 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log.id} className="border-t border-[#333] hover:bg-[#1c1c1c]">
                    <td className="px-4 py-2">
                      {log.timestamp?.toDate
                        ? log.timestamp.toDate().toLocaleString()
                        : 'Pending'}
                    </td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2">{log.performedByEmail}</td>
                    <td className="px-4 py-2">{log.targetUserEmail || '-'}</td>
                    <td className="px-4 py-2">{log.competitionId || '-'}</td>
                    <td className="px-4 py-2">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLogs.length === 0 && (
          <p className="text-gray-400 mt-4">No logs found for your current filters.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-[#00FF00] text-black hover:bg-[#00e600]'
              }`}
            >
              Prev
            </button>

            <span className="text-white pt-1">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-[#00FF00] text-black hover:bg-[#00e600]'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
