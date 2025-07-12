'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Globe,
  ListOrdered,
  Cog,
  MessageCircle,
  Handshake,
  CreditCard,
  Download,
  ShoppingBag,
  Tv2,
  LayoutDashboard,
  ClipboardList,
  Users,
  ListChecks,
  Weight,
  UserCircle,
  ScrollText,
  Scale,
  Brush,
  Trash2,
} from 'lucide-react';

interface Props {
  competitionId: string;
  activeTab?: string;
  isDirty?: boolean;
  setShowModal?: (value: boolean) => void;
  setPendingTab?: (tab: string) => void;
}

const settingsTabs = [
  { id: 'Basic', label: 'Basic', icon: ClipboardList },
  { id: 'Divisions', label: 'Divisions', icon: Users },
  { id: 'Events', label: 'Events', icon: ListChecks },
  { id: 'Weights', label: 'Weights', icon: Weight },
  { id: 'Athlete', label: 'Athlete', icon: UserCircle },
  { id: 'Roster', label: 'Roster', icon: ListOrdered },
  { id: 'Communication', label: 'Communication', icon: MessageCircle },
  { id: 'Rules', label: 'Rules', icon: ScrollText },
  { id: 'Legal', label: 'Legal', icon: Scale },
  { id: 'Financial', label: 'Financial', icon: CreditCard },
  { id: 'Branding', label: 'Branding', icon: Brush },
  { id: 'Sponsorship', label: 'Sponsorship', icon: Handshake },
  { id: 'Delete', label: 'Delete', icon: Trash2 },
];

export default function CompetitionSidebar({
  competitionId,
  activeTab,
  isDirty,
  setShowModal,
  setPendingTab,
}: Props) {
  const router = useRouter();
  const currentPath = router.asPath.split('?')[0];
  const [activeHash, setActiveHash] = useState<string>('Basic');

  useEffect(() => {
    const updateHash = () => {
      setActiveHash(window.location.hash.replace('#', '') || 'Basic');
    };
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  const parentSections = [
    { id: 'Overview', label: 'Overview', path: `/dashboard/organiser/${competitionId}/overview`, icon: LayoutDashboard },
    { id: 'Public', label: 'Public Page', path: `/dashboard/organiser/${competitionId}/public`, icon: Globe },
    { id: 'Public-Scores', label: 'Public Scores', path: `/public/competitions/${competitionId}/public-scores`, icon: ListOrdered },
    { id: 'Settings', label: 'Settings', path: `/dashboard/organiser/${competitionId}/settings`, icon: Cog, children: settingsTabs },
    { id: 'Messages', label: 'Messages', path: `/dashboard/organiser/${competitionId}/messages`, icon: MessageCircle },
    { id: 'Sponsorship', label: 'Sponsorship', path: `/dashboard/organiser/${competitionId}/sponsorship`, icon: Handshake },
    { id: 'Financial', label: 'Financial', path: `/dashboard/organiser/${competitionId}/financial`, icon: CreditCard },
    { id: 'Downloads', label: 'Downloads', path: `/dashboard/organiser/${competitionId}/downloads`, icon: Download },
    { id: 'Merchandise', label: 'Merchandise', path: `/dashboard/organiser/${competitionId}/merchandise`, icon: ShoppingBag },
    { id: 'Showtime', label: 'Show Time', path: `/dashboard/organiser/${competitionId}/showtime`, icon: Tv2 },
  ];

  const isParentActive = (section: any) => currentPath.startsWith(section.path);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isDirty && setShowModal && setPendingTab) {
      e.preventDefault();
      console.log('🛑 Blocked navigation due to unsaved changes:', href);
      setShowModal(true);
      setPendingTab(href);
    }
  };

  return (
    <div className="space-y-6">
      {parentSections.map((section) => (
        <div key={section.id}>
          <Link href={section.path} onClick={(e) => handleLinkClick(e, section.path)}>
            <div
              className={`flex items-center px-3 py-2 rounded-md font-semibold uppercase text-sm tracking-wide mb-1 ${
                isParentActive(section) ? 'text-[#00FF00]' : 'text-white hover:text-[#00FF00]'
              }`}
            >
              <section.icon size={16} className="mr-2 text-[#00FF00]" />
              {section.label}
            </div>
          </Link>

          {isParentActive(section) && section.children && (
            <ul className="ml-4 pl-2 border-l border-[#222] space-y-1">
              {section.children.map((child) => {
                const isActiveChild = activeHash === child.id;
                return (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      onClick={(e) => handleLinkClick(e, `#${child.id}`)}
                      className={`flex items-center px-2 py-1 rounded-md text-sm ${
                        isActiveChild ? 'text-[#00FF00]' : 'text-gray-300 hover:text-[#00FF00]'
                      }`}
                    >
                      <child.icon size={14} className="mr-2 text-[#00FF00]" />
                      {child.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}












