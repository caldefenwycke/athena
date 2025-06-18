// pages/dashboard/index.tsx
import { useState } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <p>This is your account profile page.</p>;
      case 'bio':
        return <p>Bio page</p>;
      case 'athlete-competitions':
        return <p>Athlete Competitions</p>;
      case 'athlete-performance':
        return <p>Athlete Performance</p>;
      case 'my-competitions':
        return <p>My Competitions</p>;
      case 'new-competition':
        return <p>New Competition</p>;
      case 'manage-athletes':
        return <p>Manage Athletes</p>;
      case 'manage-competitions':
        return <p>Manage Competitions</p>;
      default:
        return <p>Select a dashboard item from the menu.</p>;
    }
  };

  const menuItems = [
    {
      title: 'Athlete Menu',
      items: [
        { id: 'profile', label: 'Profile' },
        { id: 'bio', label: 'Bio' },
        { id: 'athlete-competitions', label: 'Athlete Competitions' },
        { id: 'athlete-performance', label: 'Athlete Performance' },
      ],
    },
    {
      title: 'Competition Menu',
      items: [
        { id: 'my-competitions', label: 'My Competitions' },
        { id: 'new-competition', label: 'New Competition' },
      ],
    },
    {
      title: 'Admin Menu',
      items: [
        { id: 'manage-athletes', label: 'Manage Athletes' },
        { id: 'manage-competitions', label: 'Manage Competitions' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-60 bg-[#0D1117] border-r border-[#1A1A1A] p-4">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-6">
            <h4 className="uppercase text-[#00FF00] font-bold mb-2">{section.title}</h4>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-2 rounded transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#00FF00] text-black font-semibold'
                        : 'text-white hover:bg-[#111]'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-4 capitalize">{activeTab.replace(/-/g, ' ')}</h1>
        <div>{renderContent()}</div>
      </main>
    </div>
  );
}
