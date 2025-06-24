// components/dashboard/competition/settings/tabs/BasicTab.tsx
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/router';

interface BasicTabProps {
  competition: {
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    organizerName?: string;
    organizerEmail?: string;
    organizerPhone?: string;
    [key: string]: any;
  };
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
}

export default function BasicTab({ competition, setCompetition }: BasicTabProps) {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const docRef = doc(db, 'competitions', id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompetition((prev: any) => ({
          ...prev,
          name: data.name || '',
          location: data.location || '',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          organizerName: data.organizerName || '',
          organizerEmail: data.organizerEmail || '',
          organizerPhone: data.organizerPhone || '',
        }));
      }
    };

    fetchData();
  }, [id, setCompetition]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompetition((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-4 max-w-xl">
      {[
        { label: 'Competition Name', key: 'name' },
        { label: 'Location', key: 'location' },
        { label: 'Start Date', key: 'startDate', type: 'date' },
        { label: 'End Date', key: 'endDate', type: 'date' },
        { label: 'Organizer Name', key: 'organizerName' },
        { label: 'Organizer Email', key: 'organizerEmail' },
        { label: 'Organizer Phone', key: 'organizerPhone' },
      ].map(({ label, key, type }) => (
        <div key={key}>
          <label className="block text-sm text-gray-400 mb-1">{label}</label>
          <input
            name={key}
            value={competition[key] || ''}
            onChange={handleChange}
            type={type || 'text'}
            className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          />
        </div>
      ))}
    </div>
  );
}
