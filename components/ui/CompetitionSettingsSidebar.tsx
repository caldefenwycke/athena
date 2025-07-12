import {
  LayoutDashboard,
  Settings,
  ListChecks,
  Dumbbell,
  Users,
  UserCheck,
  MessageCircle,
  ScrollText,
  Scale,
  CreditCard,
  Paintbrush,
  Handshake,
  Trash2,
  Info,
} from 'lucide-react';

const tabs = [
  { name: 'Overview', icon: Info },
  { name: 'Basic', icon: Settings },
  { name: 'Divisions', icon: Users },
  { name: 'Events', icon: ListChecks },
  { name: 'Weights', icon: Dumbbell },
  { name: 'Athlete', icon: UserCheck },
  { name: 'Roster', icon: LayoutDashboard },
  { name: 'Communication', icon: MessageCircle },
  { name: 'Rules', icon: ScrollText },
  { name: 'Legal', icon: Scale },
  { name: 'Financial', icon: CreditCard },
  { name: 'Branding', icon: Paintbrush },
  { name: 'Sponsorship', icon: Handshake },
  { name: 'Delete', icon: Trash2 },
];

export default function CompetitionSettingsSidebar() {
  const currentHash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';

  return (
    <div className="pt-2">
      <p className="text-white font-bold uppercase text-sm tracking-wide px-2 mb-2 border-t border-[#333] pt-4">Settings Tabs</p>
      <ul className="flex flex-col gap-1">
        {tabs.map(({ name, icon: Icon }) => {
          const isActive = currentHash === name;
          return (
            <li key={name}>
              <a
                href={`#${name}`}
                className={`flex items-center px-3 py-2 rounded transition-all text-[20px] font-normal ${
                  isActive ? 'text-[#00FF00]' : 'text-gray-300 hover:text-[#00FF00]'
                }`}
              >
                <Icon size={16} className="text-[#00FF00] mr-2" />
                {name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

