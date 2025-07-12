'use client';

import React from 'react';

interface GreenButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export default function GreenButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: GreenButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 font-semibold rounded bg-[#00FF00] text-black hover:bg-[#00cc00] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
