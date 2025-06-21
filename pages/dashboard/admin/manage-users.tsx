'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Modal from '../../../components/ui/Modal';
import Link from 'next/link';

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

  const toggleAdmin = async (user: any) => {
    const userRef = doc(db, 'users', user.id);
    const updatedRole = user.role === 'admin' ? 'user' : 'admin';
    await updateDoc(userRef, { role: updatedRole });
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, role: updatedRole } : u))
    );
  };

  const deleteUser = async (userId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;
    await deleteDoc(doc(db, 'users', userId));
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Manage Users</h1>
        </div>

        <input
          type="text"
          placeholder="Search by email..."
          className="w-full p-2 mb-6 rounded bg-[#222] text-white border border-[#333]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-[#1A1A1A] p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
            >
              <div>
                <p className="font-semibold text-white">{user.email}</p>
                <p className="text-sm text-gray-400">Role: {user.role}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={`/dashboard/admin/users/${user.id}`}
                  className="bg-[#00FF00] text-black px-4 py-1 text-sm rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggleAdmin(user)}
                  className={`px-4 py-1 text-sm rounded ${
                    user.role === 'admin'
                      ? 'border border-[#00FF00] text-[#00FF00]'
                      : 'bg-[#00FF00] text-black'
                  }`}
                >
                  {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

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
                className="bg-[#00FF00] text-black px-4 py-2 rounded font-bold"
              >
                Save Changes
              </button>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
