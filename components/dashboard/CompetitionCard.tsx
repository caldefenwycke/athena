// components/CompetitionCard.tsx
type Competition = {
  title: string;
  description: string;
  date: string;
  status: 'COMPLETED' | 'ACTIVE';
};

export default function CompetitionCard({ title, description, date, status }: Competition) {
  const badgeClass = status === 'COMPLETED' ? 'bg-gray-700' : 'bg-green-600';
  return (
    <div className="bg-gray-900 rounded-lg p-5 shadow-md text-white flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-green-400">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-gray-400">📅 {date}</span>
        <span className={`px-2 py-1 rounded ${badgeClass}`}>{status}</span>
      </div>
    </div>
  );
}
