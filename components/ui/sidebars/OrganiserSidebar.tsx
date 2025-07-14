import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Globe,
  ListOrdered,
  Cog,
  MessageCircle,
  ClipboardList,
  Users,
  ListChecks,
  Weight,
  UserCircle,
  ScrollText,
  Scale,
  CreditCard,
  Brush,
  Handshake,
  Trash,
} from 'lucide-react';

interface Props {
  competitionId?: string;
  activeTab?: string;
  isDirty?: boolean;
  setShowModal?: (value: boolean) => void;
  setPendingTab?: (tab: string) => void;
}

export default function OrganiserSidebar({
  competitionId = '',
  activeTab = 'Basic',
  isDirty = false,
  setShowModal = () => {},
  setPendingTab = () => {},
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
    { id: 'Delete', label: 'Delete', icon: Trash },
  ];

  const parentSections = [
    { id: 'Overview', label: 'Overview', path: `/dashboard/organiser/${competitionId}/overview`, icon: LayoutDashboard },
    { id: 'Public', label: 'Public Page', path: `/public/competitions/${competitionId}`, icon: Globe },
    { id: 'Public-Scores', label: 'Public scores', path: `/public/competitions/${competitionId}/public-scores`, icon: ListOrdered },
    {
      id: 'Settings',
      label: 'Settings',
      path: `/dashboard/organiser/${competitionId}/settings`,
      icon: Cog,
      children: settingsTabs,
    },
    { id: 'Messages', label: 'Messages', path: `/dashboard/organiser/${competitionId}/messages`, icon: MessageCircle },
  ];

  return (
    <nav className="text-sm">
      {parentSections.map((section) => (
        <div key={section.id} className="mb-4">
          <div
            className={`flex items-center gap-2 mb-2 ${
              currentPath.includes(section.path) ? 'text-neon-green' : 'text-white'
            }`}
          >
            <section.icon size={16} />
            <span>{section.label}</span>
          </div>

          {section.children && (
            <div className="ml-4 space-y-1">
              {section.children.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded-md ${
                    activeHash === tab.id ? 'text-neon-green' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => {
                    if (isDirty && setShowModal && setPendingTab) {
                      setShowModal(true);
                      setPendingTab(tab.id);
                    } else {
                      window.location.hash = `#${tab.id}`;
                      setActiveHash(tab.id);
                    }
                  }}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
