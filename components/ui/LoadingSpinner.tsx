'use client';

import React from 'react';

interface LoadingSpinnerProps {
  fullscreen?: boolean;
  className?: string;
  size?: number;
}

export default function LoadingSpinner({
  fullscreen = false,
  className = '',
  size = 32,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={`animate-spin rounded-full border-4 border-t-green-500 border-gray-600 ${
        fullscreen ? '' : 'inline-block'
      }`}
      style={{ width: size, height: size }}
    />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className={className}>{spinner}</div>;
}
