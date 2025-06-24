import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

export default function AthleteRegister() {
  const router = useRouter();
  const { id } = router.query; // expects ?id=competitionId
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    weightClass: '',
    division: '',
    tshirtSize: '',
    height: '',
    weight: ''
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        name: user.displayName || ''
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) {
      alert('Missing competition ID or user is not logged in.');
      return;
    }

    const ref = collection(db, 'competitions', id as string, 'athletes');
    await addDoc(ref, {
      ...formData,
      uid: user.uid,
      registeredAt: new Date()
    });

    alert('You are registered!');
    router.push('/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Register for Competition</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-[#111] p-6 rounded border border-[#222]">
          <input
            className="w-full p-2 rounded bg-[#222] text-white"
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-[#222] text-white"
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-[#222] text-white"
            type="text"
            name="weightClass"
            placeholder="Weight Class"
            onChange={handleChange}
          />
          <input
            className="w-full p-2 rounded bg-[#222] text-white"
            type="text"
            name="division"
            placeholder="Division"
            onChange={handleChange}
          />
          <input
            className="w-full p-2 rounded bg-[#222] text-white"
            type="text"
            name="tshirtSize"
            placeholder="T-Shirt Size"
            onChange={handleChange}
          />
          <input
            className="w-full p-2 rounded bg-[#222] text-white"
            type="text"
            name="height"
            placeholder="Height (cm)"
            onChange={handleChange}
          />
          <input
            className="w-full p-2 rounded bg-[#222] text-white"
            type="text"
            name="weight"
            placeholder="Weight (kg)"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-[#00FF00] text-black px-6 py-2 rounded font-bold hover:bg-[#00cc00] transition-all"
          >
            Register
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
