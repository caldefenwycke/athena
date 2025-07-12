'use client';

import React from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  widthClass = 'max-w-md',
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
      <div
        className={`relative bg-[#0D0D0D] border border-[#1A1A1A] rounded-lg p-6 w-full ${widthClass} shadow-xl`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-green-400 text-xl"
        >
          ✕
        </button>

        {/* Modal Content */}
        <div className="text-white">{children}</div>
      </div>
    </div>
  );
}
