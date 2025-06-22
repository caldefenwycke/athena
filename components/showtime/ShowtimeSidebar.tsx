'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Users,
  ListOrdered,
  CalendarDays,
  Clapperboard,
  GitBranch,
  Monitor,
  BarChart3,
  Sparkles,
  LayoutGrid
} from 'lucide-react';

interface ShowtimeSidebarProps {
  competitionId: string;
}

export default function ShowtimeSidebar({ competitionId }: ShowtimeSidebarProps) {
  const router = useRouter();
  const currentRoute = router.asPath;

  const links = [
    { name: 'Overview', path: 'overview', icon: <LayoutGrid size={18} /> },
    { name: 'Athlete Registration', path: 'athlete-registration', icon: <Users size={18} /> },
    { name: 'Events', path: 'events', icon: <CalendarDays size={18} /> },
    { name: 'Stage', path: 'stage', icon: <Clapperboard size={18} /> },
    { name: 'Screen Flow', path: 'screen-flow', icon: <GitBranch size={18} /> },
    { name: 'Screens', path: 'screens', icon: <Monitor size={18} /> },
    { name: 'Live Scoreboard', path: 'live-scoreboard', icon: <BarChart3 size={18} /> },
  ];

  return (
    <aside className="w-64 bg-[#0d0d0d] border-r border-[#1a1a1a] h-screen p-4">
      <div className="flex items-center text-[#00ff00] font-bold text-lg mb-6">
        <Sparkles size={18} className="mr-2" />
        ShowTime
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const href = {
            pathname: `/dashboard/competition/show-time/[competitionId]/${link.path}`,
            query: { competitionId },
          };
          const currentHref = `/dashboard/competition/show-time/${competitionId}/${link.path}`;
          const isActive = currentRoute === currentHref;

          return (
            <Link
              key={link.path}
              href={href}
              className={`flex items-center px-4 py-2 hover:text-[#00ff00] ${
                isActive ? 'border-l-4 border-[#00ff00] font-bold text-[#00ff00]' : 'text-white'
              }`}
            >
              <span className="mr-2">{link.icon}</span>
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
