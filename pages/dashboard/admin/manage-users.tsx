'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import BaseModal from '@/components/ui/BaseModal';
import { useAuth } from '@/components/context/AuthContext';
import { logSystemEvent } from '@/lib/logSystemEvent';

export default function ManageUsers() {
  const { user } = useAuth();
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

  const saveRoleChange = async () => {
    if (!selectedUser || !user) return;
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u))
      );
      setModalOpen(false);
      alert(`Role updated for ${selectedUser.email}`);

      await logSystemEvent({
        action: 'Role Changed',
        performedBy: user.uid,
        performedByEmail: user.email,
        targetUser: selectedUser.id,
        targetUserEmail: selectedUser.email,
        details: `Role changed to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role.');
    }
  };

  const sendResetEmail = async (email: string) => {
    if (!user) return;
    try {
      await sendPasswordResetEmail(auth, email);
      await logSystemEvent({
        action: 'Password Reset Email Sent',
        performedBy: user.uid,
        performedByEmail: user.email,
        targetUserEmail: email,
        details: `Password reset email sent to ${email}`,
      });
      alert(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset:', error);
      alert('Failed to send password reset email.');
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!user) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${email}? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'users', userId));

      await fetch('/api/admin/deleteUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUid: userId }),
      });

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert(`${email} deleted successfully.`);

      await logSystemEvent({
        action: 'User Deleted',
        performedBy: user.uid,
        performedByEmail: user.email,
        targetUser: userId,
        targetUserEmail: email,
        details: `Deleted user ${email}`,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Manage Users</h1>

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
                <p className="text-white font-semibold">
                  {user.firstName || 'No First Name'} {user.lastName || ''}
                </p>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <p className="text-gray-500 text-sm">Role: {user.role}</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => openModal(user)}
                  className="bg-[#00FF00] text-black text-sm px-3 py-1 rounded hover:bg-[#00e600]"
                >
                  Change Role
                </button>
                <button
                  onClick={() => sendResetEmail(user.email)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                >
                  Password Reset
                </button>
                <button
                  onClick={() => deleteUser(user.id, user.email)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                >
                  Delete User
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Role Edit Modal */}
        <BaseModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Edit User Role</h2>
          {selectedUser && (
            <div className="space-y-4">
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <label className="block text-white">
                <span className="text-sm">Select New Role:</span>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2 border mt-1 bg-black text-white"
                >
                  <option value="athlete">Athlete</option>
                  <option value="organiser">Organiser</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <button
                onClick={saveRoleChange}
                className="bg-[#00FF00] text-black px-4 py-2 rounded font-bold"
              >
                Save Changes
              </button>
            </div>
          )}
        </BaseModal>
      </div>
    </DashboardLayout>
  );
}


