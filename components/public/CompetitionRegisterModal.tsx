'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/context/AuthContext';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

interface CompetitionRegisterModalProps {
  competitionId: string;
  open: boolean;
  onClose: () => void;
  onRegistered?: () => void;
}

export default function CompetitionRegisterModal({
  competitionId,
  open,
  onClose,
  onRegistered,
}: CompetitionRegisterModalProps) {
  const { user } = useAuth();
  const [divisions, setDivisions] = useState<string[]>([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDivisions = async () => {
      if (!competitionId) return;

      try {
        const compRef = doc(db, 'competitions', competitionId);
        const compSnap = await getDoc(compRef);

        if (compSnap.exists()) {
          const compData = compSnap.data();
          setDivisions(compData.divisions || []);
        }
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    };

    if (open) {
      fetchDivisions();
    }
  }, [open, competitionId]);

  const handleRegister = async () => {
    if (!user) {
      alert('You must be logged in.');
      return;
    }

    if (!selectedDivision) {
      alert('Please select a division.');
      return;
    }

    setLoading(true);

    try {
      const regRef = doc(db, 'competitions', competitionId, 'registrations', user.uid);
      await setDoc(regRef, {
        division: selectedDivision,
        timestamp: Timestamp.now(),
      });

      if (onRegistered) {
        onRegistered();
      }

      onClose();
      alert('You have successfully registered!');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#111',
          color: '#fff',
          p: 4,
          borderRadius: 2,
          width: '90%',
          maxWidth: 500,
        }}
      >
        <h2 className="text-xl font-bold mb-4">Register for Competition</h2>

        <div className="mb-4">
          <label className="block mb-1">Select Division:</label>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-gray-700 text-white rounded"
          >
            <option value="">-- Select Division --</option>
            {divisions.map((div, index) => (
              <option key={index} value={div}>
                {div}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-[#00FF00] text-black px-4 py-2 rounded font-bold hover:bg-[#00cc00] disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Confirm and Register'}
          </button>
        </div>
      </Box>
    </Modal>
  );
}
