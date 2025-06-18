// components/DashboardSidebar.tsx
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardSidebar() {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const isActive = (path: string) => router.pathname === path;

  const menu = [
    {
      title: 'Athlete Menu',
      key: 'athlete',
      links: [
        { label: 'Athlete Overview', href: '/dashboard/athlete/overview' },
        { label: 'My Competitions', href: '/dashboard/athlete/my-competitions' },
      ],
    },
    {
      title: 'Competition Menu',
      key: 'competition',
      links: [
        { label: 'Competition Settings', href: '/dashboard/competition/settings' },
        { label: 'Overview', href: '/dashboard/competition/overview' },
        { label: 'Athlete Roster', href: '/dashboard/competition/roster' },
        { label: 'Communication', href: '/dashboard/competition/communication' },
        { label: 'Financials', href: '/dashboard/competition/financials' },
      ],
    },
    {
      title: 'Sponsor Menu',
      key: 'sponsor',
      links: [
        { label: 'Sponsorships', href: '/dashboard/sponsor/sponsorships' },
      ],
    },
    {
      title: 'Admin Menu',
      key: 'admin',
      links: [
        { label: 'Manage Competitions', href: '/dashboard/admin/manage-competitions' },
        { label: 'User Management', href: '/dashboard/admin/user-management' },
        { label: 'System Logs', href: '/dashboard/admin/logs' },
      ],
    },
  ];

  const currentSection = menu.find(m => m.key === openSection);

  return (
    <aside className="w-64 bg-black text-white p-4 border-r border-[#222] flex flex-col justify-between h-screen">
      <div>
        {menu.map(({ title, key }) => (
          <button
            key={key}
            className={`w-full text-left px-2 py-2 ${openSection === key ? 'text-[#00FF00]' : 'text-white'}`}
            onClick={() => setOpenSection(openSection === key ? null : key)}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Submenu section */}
      {currentSection && (
        <div className="mt-4 border-t border-[#444] pt-4">
          {currentSection.links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-1 text-sm border-l pl-2 ${
                isActive(href) ? 'text-[#00FF00] border-[#00FF00]' : 'text-white border-[#333]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}
