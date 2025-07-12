'use client';

import React from 'react';
import BaseModal from './BaseModal';

interface AthenaModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  onDiscard: () => void;
}

export default function AthenaModal({
  title,
  message,
  onConfirm,
  onCancel,
  onDiscard,
}: AthenaModalProps) {
  return (
    <BaseModal isOpen={true} onClose={onCancel} widthClass="max-w-md">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-red-400">{title}</h2>
        <p className="text-sm text-gray-300">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onDiscard}
            className="bg-yellow-500 px-4 py-2 text-black rounded font-semibold"
          >
            Discard Changes
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-500 px-4 py-2 text-black rounded font-semibold"
          >
            Save and Continue
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-700 px-4 py-2 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
