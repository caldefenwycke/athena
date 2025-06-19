import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface MenuItem {
  id: string;
  label: string;
  path: string;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    id: 'athlete',
    title: 'Athlete Menu',
    items: [
      { id: 'profile', label: 'Profile', path: '/dashboard/athlete/profile' },
      { id: 'bio', label: 'Bio', path: '/dashboard/athlete/bio' },
      { id: 'athlete-competitions', label: 'Athlete Competitions', path: '/dashboard/athlete/athlete-competitions' },
      { id: 'athlete-performance', label: 'Athlete Performance', path: '/dashboard/athlete/athlete-performance' }
    ]
  },
  {
    id: 'competition',
    title: 'Competition Menu',
    items: [
      { id: 'my-competitions', label: 'My Competitions', path: '/dashboard/competition/my-competitions' },
      { id: 'new-competition', label: 'New Competition', path: '/dashboard/competition/new-competition' }
    ]
  },
  {
    id: 'sponsor',
    title: 'Sponsor Menu',
    items: [
      { id: 'my-sponsors', label: 'My Sponsors', path: '/dashboard/sponsor/my-sponsors' },
      { id: 'manage-sponsorships', label: 'Manage Sponsorships', path: '/dashboard/sponsor/manage-sponsorships' }
    ]
  },
  {
    id: 'admin',
    title: 'Admin Menu',
    items: [
      { id: 'manage-competitions', label: 'Manage Competitions', path: '/dashboard/admin/manage-competitions' },
      { id: 'user-management', label: 'User Management', path: '/dashboard/admin/user-management' },
      { id: 'system-logs', label: 'System Logs', path: '/dashboard/admin/system-logs' }
    ]
  }
];

export default function DashboardSidebar() {
  const router = useRouter();

  const findCurrentSection = () => {
    for (const section of menuSections) {
      if (section.items.some(item => router.pathname.startsWith(item.path))) {
        return section.id;
      }
    }
    return '';
  };

  const [expanded, setExpanded] = useState<string>('');

  useEffect(() => {
    const current = findCurrentSection();
    setExpanded(current);
  }, [router.pathname]);

  const handleToggle = (id: string) => {
    setExpanded(prev => (prev === id ? '' : id));
  };

  const selectedSection = menuSections.find(section => section.id === expanded);

  return (
    <aside className="w-64 min-h-screen bg-black text-white pt-8 pl-6 pr-2 flex flex-col justify-start">
      <div>
        {menuSections.map(section => (
          <div key={section.id} className="mb-6">
            <button
              onClick={() => handleToggle(section.id)}
              className={`text-left text-[20px] transition-colors duration-150 ${
                expanded === section.id ? 'text-[#00FF00]' : 'text-white'
              } hover:text-[#00FF00]`}
            >
              {section.title}
            </button>
          </div>
        ))}
      </div>

      {selectedSection && (
        <ul className="mt-2 pl-4 border-l border-gray-600">
          {selectedSection.items.map(item => (
            <li key={item.id}>
              <Link
                href={item.path}
                className={`block py-1 pl-2 pr-3 text-[20px] mt-1 transition-all duration-150 hover:text-[#00FF00] ${
                  router.pathname === item.path ? 'text-[#00FF00]' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
