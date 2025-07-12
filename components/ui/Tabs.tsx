'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface TabOption {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: TabOption[];
}

export default function Tabs({ tabs }: TabsProps) {
  const router = useRouter();
  const [active, setActive] = useState<string>('Overview');

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      setActive(hash || 'Overview');
    };
    updateFromHash();
    window.addEventListener('hashchange', updateFromHash);
    return () => window.removeEventListener('hashchange', updateFromHash);
  }, []);

  const handleTabClick = (tabKey: string) => {
    router.push(`${window.location.pathname}#${tabKey}`);
    setActive(tabKey);
  };

  return (
    <div className="flex flex-wrap border-b border-[#222] mb-6 text-sm">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleTabClick(tab.key)}
          className={`px-4 py-2 font-semibold border-b-2 transition-all ${
            active === tab.key
              ? 'border-[#00FF00] text-[#00FF00]'
              : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
