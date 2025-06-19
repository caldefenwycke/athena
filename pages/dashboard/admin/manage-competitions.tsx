'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Modal from '../../../components/ui/Modal';

export default function ManageCompetitions() {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedComp, setSelectedComp] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState({ name: '', organiser: '' });

  useEffect(() => {
    const fetchCompetitions = async () => {
      const snapshot = await getDocs(collection(db, 'competitions'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompetitions(data);
    };

    fetchCompetitions();
  }, []);

  const openModal = (comp: any) => {
    setSelectedComp(comp);
    setEditData({ name: comp.name || '', organiser: comp.organiser || '' });
    setModalOpen(true);
  };

  const saveChanges = async () => {
    if (selectedComp) {
      const compRef = doc(db, 'competitions', selectedComp.id);
      await updateDoc(compRef, {
        name: editData.name,
        organiser: editData.organiser,
      });

      setCompetitions((prev) =>
        prev.map((c) =>
          c.id === selectedComp.id ? { ...c, ...editData } : c
        )
      );
      setModalOpen(false);
    }
  };

  const filteredComps = competitions.filter((comp) =>
    comp.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Competitions</h1>
      <input
        type="text"
        placeholder="Search by name..."
        className="w-full p-2 border mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="space-y-4">
        {filteredComps.map((comp) => (
          <li key={comp.id} className="border p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{comp.name}</p>
              <p className="text-sm text-gray-500">
                Organiser: {comp.organiser || 'N/A'}
              </p>
            </div>
            <button
              onClick={() => openModal(comp)}
              className="text-blue-500 underline"
            >
              Manage
            </button>
          </li>
        ))}
      </ul>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Competition</h2>
        {selectedComp && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-700">Competition Name</span>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full p-2 border mt-1"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Organiser</span>
              <input
                type="text"
                value={editData.organiser}
                onChange={(e) =>
                  setEditData({ ...editData, organiser: e.target.value })
                }
                className="w-full p-2 border mt-1"
              />
            </label>
            <button
              onClick={saveChanges}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
