import Link from 'next/link';
import { useRouter } from 'next/router';
import { User, Trophy, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface MenuItem {
  id: string;
  label: string;
  path: string;
}

interface MenuSection {
  id: string;
  title: string;
  icon: JSX.Element;
  items: MenuItem[];
}

export default function DashboardSidebar() {
  const router = useRouter();
  const { user } = useAuth();

  const menuSections: MenuSection[] = [
    {
      id: 'athlete',
      title: 'Athlete',
      icon: <User className="w-5 h-5 mr-2" />,
      items: [
        { id: 'profile', label: 'Profile', path: '/dashboard/athlete/profile' },
        { id: 'bio', label: 'Bio', path: '/dashboard/athlete/bio' },
        { id: 'athlete-competitions', label: 'Athlete Competitions', path: '/dashboard/athlete/athlete-competitions' },
        { id: 'athlete-performance', label: 'Athlete Performance', path: '/dashboard/athlete/athlete-performance' },
      ],
    },
    {
      id: 'competition',
      title: 'Competition',
      icon: <Trophy className="w-5 h-5 mr-2" />,
      items: [
        { id: 'my-competitions', label: 'My Competitions', path: '/dashboard/competition/my-competitions' },
       ],
    },
    // ✅ Only include Admin section if user role is admin
    ...(user?.role === 'admin'
      ? [
          {
            id: 'admin',
            title: 'Admin',
            icon: <Shield className="w-5 h-5 mr-2" />,
            items: [
              { id: 'manage-users', label: 'Manage Users', path: '/dashboard/admin/manage-users' },
              { id: 'manage-competitions', label: 'Manage Comps', path: '/dashboard/admin/manage-competitions' },
              { id: 'system-logs', label: 'System Logs', path: '/dashboard/admin/system-logs' },
            ],
          },
        ]
      : []),
  ];

  const activeSection = menuSections.find((section) =>
    section.items.some((item) => router.pathname === item.path)
  );

  return (
    <div className="flex flex-col gap-4">
      {menuSections.map((section) => {
        const isActive = section === activeSection;
        const firstChildPath = section.items[0]?.path || '#';

        return (
          <Link
            key={section.id}
            href={firstChildPath}
            className={`rounded-md px-3 py-2 text-[20px] uppercase tracking-wide block transition flex items-center ${
              isActive ? 'bg-[#00FF00] text-black font-bold' : 'text-[#00FF00] hover:text-[#00FF00] font-normal'
            }`}
          >
            {section.icon}
            {section.title}
          </Link>
        );
      })}

      {activeSection && (
        <ul className="flex flex-col gap-1 pt-2 pl-4 border-t border-[#333] mt-2">
          {activeSection.items.map((item) => {
            const isActiveItem = router.pathname === item.path;
            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={`block px-2 py-1 rounded transition-colors text-[20px] font-normal ${
                    isActiveItem
                      ? 'text-[#00FF00]'
                      : 'text-white hover:text-[#00FF00]'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}


