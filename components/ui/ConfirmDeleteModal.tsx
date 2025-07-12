'use client';

import BaseModal from './BaseModal';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  description = 'Are you sure you want to permanently delete this? This action cannot be undone.',
  confirmLabel = 'Delete',
}: ConfirmDeleteModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-red-400">{title}</h2>
      <p className="mb-4 text-gray-300">{description}</p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="border border-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
        >
          {confirmLabel}
        </button>
      </div>
    </BaseModal>
  );
}
