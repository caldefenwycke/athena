import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Globe,
  Settings,
  MessageCircle,
  CreditCard,
  Tv2,
  ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const sections = [
  {
    title: 'Public Page',
    icon: Globe,
    pathSuffix: 'public',
  },
  {
    title: 'Competition Settings',
    icon: Settings,
    pathSuffix: 'settings',
  },
  {
    title: 'Communication',
    icon: MessageCircle,
    pathSuffix: 'communication',
  },
  {
    title: 'Financial',
    icon: CreditCard,
    pathSuffix: 'financial',
  },
  {
    title: 'Show Time',
    icon: Tv2,
    pathSuffix: 'showtime',
  },
];

const settingsChildren = [
  'Overview',
  'Basic',
  'Divisions',
  'Events',
  'Weights',
  'Athlete',
  'Roster',
  'Communication',
  'Rules',
  'Legal',
  'Financial',
  'Branding',
  'Sponsorship',
  'Delete',
];

interface Props {
  competitionId: string;
}

export default function CompetitionPortalSidebar({ competitionId }: Props) {
  const router = useRouter();
  const currentPath = router.asPath;

  const [hash, setHash] = useState<string>('');

  useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash.replace('#', '') || '');
    };
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => {
        const href = `/portal/${competitionId}/${section.pathSuffix}`;
        const isActive = currentPath.split('?')[0] === href;

        return (
          <Link
            key={section.title}
            href={href}
            className={`rounded-md px-3 py-2 text-[18px] uppercase tracking-wide block transition flex items-center ${
              isActive
                ? 'bg-[#00FF00] text-black font-bold'
                : 'text-[#00FF00] hover:text-[#00FF00] font-normal'
            }`}
          >
            <section.icon className="w-5 h-5 mr-2" />
            {section.title}
          </Link>
        );
      })}

      {/* Divider */}
      <hr className="border-t border-[#333] my-3" />

      {/* Settings children - only show on settings page */}
      {currentPath.includes('/settings') && (
        <ul className="flex flex-col gap-1">
          {settingsChildren.map((tab) => (
            <li key={tab}>
              <a
                href={`#${tab}`}
                className={`block px-2 py-1 rounded transition-colors text-[16px] font-normal ${
                  hash === tab || (!window.location.hash && tab === 'Overview')
                    ? 'text-[#00FF00] font-semibold'
                    : 'text-white hover:text-[#00FF00]'
                }`}
              >
                <ChevronRight className="inline w-4 h-4 mr-1" />
                {tab}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


