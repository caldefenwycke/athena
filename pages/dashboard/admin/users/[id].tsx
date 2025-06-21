'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
import Link from 'next/link';

export default function AdminUserProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    displayName: '',
    dob: '',
    age: '',
    phone: '',
    email: '',
    street: '',
    area: '',
    town: '',
    country: '',
    postcode: '',
    role: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      const userRef = doc(db, 'users', id as string);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUser({ id, ...data });
        setForm({
          displayName: data.displayName || '',
          dob: data.dob || '',
          age: data.age || '',
          phone: data.phone || '',
          email: data.email || '',
          street: data.street || '',
          area: data.area || '',
          town: data.town || '',
          country: data.country || '',
          postcode: data.postcode || '',
          role: data.role || '',
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, form);
    alert('User profile updated.');
    router.push('/dashboard/admin/manage-users');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-white p-6">Loading user data...</div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-white p-6">User not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto bg-[#1A1A1A] text-white p-6 rounded border border-[#333] mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit User Profile</h1>
          <Link
            href="/dashboard/admin/manage-users"
            className="bg-[#00FF00] text-black px-4 py-2 rounded font-semibold text-sm"
          >
            Back
          </Link>
        </div>

        {[
          { label: 'Display Name', name: 'displayName' },
          { label: 'Date of Birth', name: 'dob', type: 'date' },
          { label: 'Age', name: 'age' },
          { label: 'Mobile Number', name: 'phone' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Street', name: 'street' },
          { label: 'Area', name: 'area' },
          { label: 'Town', name: 'town' },
          { label: 'Country', name: 'country' },
          { label: 'Post Code', name: 'postcode' },
        ].map(({ label, name, type = 'text' }) => (
          <label className="block mb-4" key={name}>
            <span className="text-sm">{label}</span>
            <input
              name={name}
              type={type}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-[#111] border border-[#444] rounded text-white"
            />
          </label>
        ))}

        <label className="block mb-6">
          <span className="text-sm">Role</span>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full mt-1 p-2 bg-[#111] border border-[#444] rounded text-white"
          >
            <option value="athlete">Athlete</option>
            <option value="organiser">Organiser</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button
          onClick={handleSave}
          className="bg-[#00FF00] text-black px-6 py-2 rounded font-bold"
        >
          Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
}
