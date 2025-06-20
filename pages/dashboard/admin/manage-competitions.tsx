import DashboardLayout from '@/components/layouts/DashboardLayout';

const mockCompetitions = [
  {
    id: '1',
    name: 'Herm Strongest 2025',
    location: 'Herm Island',
    date: '2025-08-15',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Guernsey Gauntlet',
    location: 'Guernsey',
    date: '2025-09-10',
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Sark Showdown',
    location: 'Sark',
    date: '2025-10-01',
    status: 'Suspended',
  },
];

export default function ManageCompetitions() {
  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Manage Competitions</h1>
          <button className="bg-[#00FF00] text-black px-4 py-2 rounded font-semibold hover:bg-[#00cc00]">
            Create New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[#00FF00] border-b border-[#333]">
                <th className="py-2">Name</th>
                <th className="py-2">Location</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCompetitions.map((comp) => (
                <tr key={comp.id} className="border-t border-[#333] hover:bg-[#1c1c1c]">
                  <td className="py-2">{comp.name}</td>
                  <td className="py-2">{comp.location}</td>
                  <td className="py-2">{comp.date}</td>
                  <td className="py-2">{comp.status}</td>
                  <td className="py-2">
                    <button className="text-[#00FF00] hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
