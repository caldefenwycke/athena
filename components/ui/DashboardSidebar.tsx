import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  User,
  UserCheck,
  Trophy,
  Shield,
  LayoutDashboard,
  BarChart2,
  MessageCircle,
  ScrollText,
} from 'lucide-react';

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = router.pathname;

  const sidebarStructure = [
    {
      title: 'Athlete',
      path: '/dashboard/athlete/profile',
      icon: User,
      children: [
        { label: 'Profile', path: '/dashboard/athlete/profile', icon: UserCheck },
        { label: 'Bio', path: '/dashboard/athlete/bio', icon: UserCheck },
        { label: 'Athlete Competitions', path: '/dashboard/athlete/athlete-competitions', icon: BarChart2 },
        { label: 'Athlete Performance', path: '/dashboard/athlete/athlete-performance', icon: BarChart2 },
        { label: 'Messages', path: '/dashboard/athlete/messages', icon: MessageCircle },
      ],
    },
    {
      title: 'Organiser',
      path: '/dashboard/organiser/my-competitions',
      icon: Trophy,
      children: [
        { label: 'My Competitions', path: '/dashboard/organiser/my-competitions', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Admin',
      path: '/dashboard/admin/manage-users',
      icon: Shield,
      children: [
        { label: 'Manage Users', path: '/dashboard/admin/manage-users', icon: UserCheck },
        { label: 'Manage Comps', path: '/dashboard/admin/manage-competitions', icon: LayoutDashboard },
        { label: 'System Logs', path: '/dashboard/admin/system-logs', icon: ScrollText },
      ],
    },
  ];

  const isActivePath = (targetPath: string) => {
    return pathname === targetPath;
  };

  const isParentActive = (section: any) => {
    if (isActivePath(section.path)) return true;
    if (section.children) {
      return section.children.some((c: any) => isActivePath(c.path));
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {sidebarStructure.map((section) => (
        <div key={section.title}>
          <Link href={section.path}>
            <div
              className={`flex items-center px-3 py-2 rounded-md font-semibold uppercase text-sm tracking-wide mb-1 ${
                isParentActive(section) ? 'text-[#00FF00]' : 'text-white hover:text-[#00FF00]'
              }`}
            >
              <section.icon size={16} className="mr-2 text-[#00FF00]" />
              {section.title}
            </div>
          </Link>

          {isParentActive(section) && section.children && (
            <ul className="ml-4 pl-2 border-l border-[#222] space-y-1">
              {section.children.map((child) => (
                <li key={child.label}>
                  <Link href={child.path}>
                    <div
                      className={`flex items-center px-2 py-1 rounded-md text-sm ${
                        isActivePath(child.path)
                          ? 'text-[#00FF00]'
                          : 'text-gray-300 hover:text-[#00FF00]'
                      }`}
                    >
                      <child.icon size={14} className="mr-2" />
                      {child.label}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}









