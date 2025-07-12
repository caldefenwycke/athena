import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    addressTown: '',
    addressArea: '',
    addressPostCode: '',
    addressCountry: '',
  });

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile((prev) => ({
            ...prev,
            ...data,
            email: user.email || data.email || '',
          }));
        } else {
          setProfile((prev) => ({ ...prev, email: user.email || '' }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setErrorMessage('⚠️ Failed to load profile data');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, profile, { merge: true });
      setSuccessMessage('✅ Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('❌ Failed to save profile');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const fields: [keyof typeof profile, string][] = [
    ['firstName', 'First Name/s'],
    ['lastName', 'Last Name'],
    ['dob', 'Date of Birth'],
    ['email', 'Email'],
    ['addressLine1', 'Address Line 1'],
    ['addressLine2', 'Address Line 2'],
    ['addressTown', 'Address Town'],
    ['addressArea', 'Address Area'],
    ['addressPostCode', 'Post/Zip Code'],
    ['addressCountry', 'Country'],
  ];

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6 relative">
        {(successMessage || errorMessage) && (
          <div
            className={`absolute top-0 left-0 right-0 text-black font-bold text-center py-2 rounded-t ${
              successMessage ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {successMessage || errorMessage}
          </div>
        )}

        <div className="flex justify-between items-center mb-6 pt-2">
          <h2 className="text-2xl font-bold text-white">Profile Details</h2>
          <button
            className="bg-[#00FF00] hover:bg-[#00dd00] text-black font-bold px-4 py-1 rounded"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm mt-2">
          {fields.map(([key, label]) => (
            <div key={key}>
              <p className="text-[#00FF00] font-medium">{label}</p>
              {isEditing ? (
                <input
                  name={key}
                  value={profile[key] || ''}
                  onChange={handleChange}
                  className="bg-black text-white border border-gray-700 px-2 py-1 rounded w-full"
                />
              ) : (
                <p className="text-white">{profile[key] || 'Not set'}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
