// components/Sidebar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import classNames from 'classnames';

const menuSections = [
  {
    id: 'athlete',
    label: 'Athlete Menu',
    links: [
      { href: '/dashboard/athlete/profile', label: 'Profile' },
      { href: '/dashboard/athlete/bio', label: 'Bio' },
      { href: '/dashboard/athlete/competitions', label: 'Athlete Competitions' },
      { href: '/dashboard/athlete/performance', label: 'Athlete Performance' },
    ],
  },
  {
    id: 'competition',
    label: 'Competition Menu',
    links: [
      { href: '/dashboard/competition/my-competitions', label: 'My Competitions' },
      { href: '/dashboard/competition/new-competition', label: 'New Competition' },
    ],
  },
  {
    id: 'sponsor',
    label: 'Sponsor Menu',
    links: [
      { href: '/dashboard/sponsor/manage-sponsors', label: 'Manage Sponsors' },
      { href: '/dashboard/sponsor/sponsor-requests', label: 'Sponsor Requests' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin Menu',
    links: [
      { href: '/dashboard/admin/manage-competitions', label: 'Manage Competitions' },
      { href: '/dashboard/admin/user-management', label: 'User Management' },
      { href: '/dashboard/admin/system-logs', label: 'System Logs' },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>('athlete');

  const handleToggle = (sectionId: string) => {
    setOpenSection(prev => (prev === sectionId ? null : sectionId));
  };

  return (
    <aside className="w-64 bg-black text-white px-4 pt-8 flex flex-col">
      {menuSections.map(section => (
        <div key={section.id} className="mb-2">
          <button
            onClick={() => handleToggle(section.id)}
            className={classNames(
              'text-left w-full px-2 py-2 transition-colors',
              openSection === section.id ? 'text-[#00FF00]' : 'text-white'
            )}
          >
            {section.label}
          </button>
        </div>
      ))}

      {/* Submenus below all menu headers */}
      <div className="mt-4 border-t border-gray-800 pt-4 space-y-2">
        {menuSections
          .find(section => section.id === openSection)
          ?.links.map(link => (
            <Link href={link.href} key={link.href}>
              <a
                className={classNames(
                  'block pl-4 border-l-2 text-sm py-1 transition-colors',
                  router.pathname === link.href
                    ? 'text-[#00FF00] border-[#00FF00]'
                    : 'text-white border-transparent hover:border-gray-500 hover:text-gray-300'
                )}
              >
                {link.label}
              </a>
            </Link>
          ))}
      </div>
    </aside>
  );
}
