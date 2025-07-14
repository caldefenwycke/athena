'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
  title?: string;
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  widthClass = 'max-w-xl',
  title,
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className={`relative w-full ${widthClass} p-6 bg-[#111] text-white rounded-xl shadow-lg`}>
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-white hover:text-[#00FF00] transition"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Optional Title */}
        {title && (
          <div className="text-center text-[#00FF00] text-xl font-bold mb-6">
            {title}
          </div>
        )}

        {/* Modal Body */}
        {children}
      </div>
    </div>
  );
}
