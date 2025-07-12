'use client';

import React, { useEffect, useRef } from 'react';

interface AutoSaveSectionProps {
  markDirty: () => void;
  children: React.ReactNode;
}

const AutoSaveSection: React.FC<AutoSaveSectionProps> = ({ markDirty, children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const handleChange = () => markDirty();

    const inputs = wrapperRef.current.querySelectorAll('input, select, textarea');

    inputs.forEach((el) => {
      el.addEventListener('change', handleChange);
    });

    return () => {
      inputs.forEach((el) => {
        el.removeEventListener('change', handleChange);
      });
    };
  }, [markDirty]);

  return <div ref={wrapperRef}>{children}</div>;
};

export default AutoSaveSection;
