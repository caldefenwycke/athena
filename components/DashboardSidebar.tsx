import Link from 'next/link';
import { useRouter } from 'next/router';

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
      { id: 'athlete-performance', label: 'Athlete Performance', path: '/dashboard/athlete/athlete-performance' },
    ],
  },
  {
    id: 'competition',
    title: 'Competition Menu',
    items: [
      { id: 'my-competitions', label: 'My Competitions', path: '/dashboard/competition/my-competitions' },
      { id: 'new-competition', label: 'New Competition', path: '/dashboard/competition/new-competition' },
    ],
  },
  {
    id: 'admin',
    title: 'Admin Menu',
    items: [
      { id: 'manage-users', label: 'Manage Users', path: '/dashboard/admin/manage-users' },
      { id: 'manage-competitions', label: 'Manage Competitions', path: '/dashboard/admin/manage-competitions' },
    ],
  },
];

export default function DashboardSidebar() {
  const router = useRouter();

  const activeSection = menuSections.find(section =>
    section.items.some(item => router.pathname === item.path)
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Parent headers as links */}
      {menuSections.map((section) => {
        const isActive = section === activeSection;
        const firstChildPath = section.items[0]?.path || '#';

        return (
          <Link
            key={section.id}
            href={firstChildPath}
            className={`rounded-md px-3 py-2 font-semibold text-sm uppercase tracking-wide block transition ${
              isActive ? 'bg-[#00FF00] text-black' : 'text-[#00FF00] hover:text-[#00FF00]'
            }`}
          >
            {section.title}
          </Link>
        );
      })}

      {/* Active section's children shown beneath all parents */}
      {activeSection && (
        <ul className="flex flex-col gap-1 pt-2 pl-4 border-t border-[#333] mt-2">
          {activeSection.items.map((item) => {
            const isActiveItem = router.pathname === item.path;
            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={`block px-2 py-1 rounded transition-colors ${
                    isActiveItem
                      ? 'text-[#00FF00] font-semibold'
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
