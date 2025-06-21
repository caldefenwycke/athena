'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Sparkles,
  LayoutDashboard,
  Users,
  CalendarDays,
  Clapperboard,
  Workflow,
  Monitor,
  BarChart2,
  ArrowLeftCircle,
} from 'lucide-react';

export default function ShowtimeSidebar({ competitionId }: { competitionId: string }) {
  const router = useRouter();

  if (!competitionId || typeof competitionId !== 'string') {
    return null; // fallback UI
  }

  const links = [
    { name: 'Overview', href: `/dashboard/competition/show-time/${competitionId}`, icon: <LayoutDashboard /> },
    { name: 'Athlete Registration', href: `/dashboard/competition/show-time/${competitionId}/athlete-registration`, icon: <Users /> },
    { name: 'Events', href: `/dashboard/competition/show-time/${competitionId}/events`, icon: <CalendarDays /> },
    { name: 'Stage', href: `/dashboard/competition/show-time/${competitionId}/stage`, icon: <Clapperboard /> },
    { name: 'Screen Flow', href: `/dashboard/competition/show-time/${competitionId}/screen-flow`, icon: <Workflow /> },
    { name: 'Screens', href: `/dashboard/competition/show-time/${competitionId}/screens`, icon: <Monitor /> },
    { name: 'Live Scoreboard', href: `/dashboard/competition/show-time/${competitionId}/scoreboard`, icon: <BarChart2 /> },
    { name: 'Back to Dashboard', href: `/dashboard/competition/show-time`, icon: <ArrowLeftCircle /> },
  ];

  return (
    <div className="bg-[#111] w-60 min-h-screen p-4 border-r border-[#2a2a2a]">
      <div className="mb-6 px-2 pt-4 pb-2">
        <p className="font-bold text-sm flex items-center space-x-2 text-[#00FF00]">
          <Sparkles className="text-[#00FF00]" />
          <span className="text-lg">ShowTime</span>
        </p>
      </div>

      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.href}>
              <div
                className={`flex items-center px-3 py-2 rounded text-sm cursor-pointer transition-colors ${
                  router.asPath.startsWith(link.href)
                    ? 'bg-[#00FF00] text-black font-bold'
                    : 'text-white hover:bg-[#222]'
                }`}
              >
                <span className="mr-2 text-lg">{link.icon}</span>
                {link.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
