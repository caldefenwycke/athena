import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Globe,
  Settings as Cog,
  MessageCircle,
  CreditCard,
  Tv2,
  LayoutDashboard,
  ClipboardList,
  Users,
  ListChecks,
  Weight,
  UserCircle,
  ListOrdered,
  ScrollText,
  Scale,
  Brush,
  Handshake,
  Trash2,
  Download,
  ShoppingBag,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const sections = [
  { title: 'Public Page', icon: Globe, pathSuffix: 'public' },
  { title: 'Public Scores', icon: ListOrdered, pathSuffix: 'scores' },
  { title: 'Settings', icon: Cog, pathSuffix: 'settings' },
  { title: 'Messages', icon: MessageCircle, pathSuffix: 'communication' },
  { title: 'Sponsorship', icon: Handshake, pathSuffix: 'sponsorship' },
  { title: 'Financial', icon: CreditCard, pathSuffix: 'financial' },
  { title: 'Downloads', icon: Download, pathSuffix: 'downloads' },
  { title: 'Merchandise', icon: ShoppingBag, pathSuffix: 'merchandise' },
  { title: 'Show Time', icon: Tv2, pathSuffix: 'showtime' },
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

const tabIcons: Record<string, JSX.Element> = {
  Overview: <LayoutDashboard className="inline w-4 h-4 mr-1" />,
  Basic: <ClipboardList className="inline w-4 h-4 mr-1" />,
  Divisions: <Users className="inline w-4 h-4 mr-1" />,
  Events: <ListChecks className="inline w-4 h-4 mr-1" />,
  Weights: <Weight className="inline w-4 h-4 mr-1" />,
  Athlete: <UserCircle className="inline w-4 h-4 mr-1" />,
  Roster: <ListOrdered className="inline w-4 h-4 mr-1" />,
  Communication: <MessageCircle className="inline w-4 h-4 mr-1" />,
  Rules: <ScrollText className="inline w-4 h-4 mr-1" />,
  Legal: <Scale className="inline w-4 h-4 mr-1" />,
  Financial: <CreditCard className="inline w-4 h-4 mr-1" />,
  Branding: <Brush className="inline w-4 h-4 mr-1" />,
  Sponsorship: <Handshake className="inline w-4 h-4 mr-1" />,
  Delete: <Trash2 className="inline w-4 h-4 mr-1" />,
};

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
            className={`rounded-md px-3 py-2 text-[20px] uppercase tracking-wide block transition flex items-center gap-2 ${
              isActive
                ? 'bg-[#00FF00] text-black font-bold'
                : 'text-[#00FF00] hover:text-[#00FF00] font-normal'
            }`}
          >
            <section.icon className="w-5 h-5" />
            <span className="truncate">{section.title}</span>
          </Link>
        );
      })}

      <hr className="border-t border-[#333] my-3" />

      {currentPath.includes('/settings') && (
        <ul className="flex flex-col gap-1 pt-2 pl-4 border-t border-[#333] mt-2">
          {settingsChildren.map((tab) => {
            const isActive = hash === tab || (!window.location.hash && tab === 'Overview');
            return (
              <li key={tab}>
                <a
                  href={`#${tab}`}
                  className={`block px-2 py-1 rounded transition-colors text-[20px] font-normal ${
                    isActive
                      ? 'text-[#00FF00] font-semibold'
                      : 'text-white hover:text-[#00FF00]'
                  }`}
                >
                  {tabIcons[tab]} {tab}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}



