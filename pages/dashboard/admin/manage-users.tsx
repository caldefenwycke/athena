'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Modal from '../../../components/ui/Modal';

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const openModal = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setModalOpen(true);
  };

  const saveChanges = async () => {
    if (selectedUser) {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, { role: newRole });

      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u))
      );
      setModalOpen(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <input
        type="text"
        placeholder="Search by email..."
        className="w-full p-2 border mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="space-y-4">
        {filteredUsers.map((user) => (
          <li key={user.id} className="border p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{user.email}</p>
              <p className="text-sm text-gray-500">Role: {user.role}</p>
            </div>
            <button
              onClick={() => openModal(user)}
              className="text-blue-500 underline"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        {selectedUser && (
          <div className="space-y-4">
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <label className="block">
              <span className="text-sm text-gray-700">Role</span>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full p-2 border mt-1"
              >
                <option value="athlete">Athlete</option>
                <option value="organiser">Organiser</option>
                <option value="admin">Admin</option>
              </select>
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
