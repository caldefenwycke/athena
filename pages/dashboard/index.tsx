// pages/dashboard/index.tsx
import { useState } from 'react';
import Header from '@/components/Header';

import Profile from '@/components/dashboard/Profile';
import Bio from '@/components/dashboard/Bio';
import AthleteCompetitions from '@/components/dashboard/AthleteCompetitions';
import AthletePerformance from '@/components/dashboard/AthletePerformance';
import MyCompetitions from '@/components/dashboard/MyCompetitions';
import NewCompetition from '@/components/dashboard/NewCompetition';
import ManageAthletes from '@/components/dashboard/ManageAthletes';
import ManageCompetitions from '@/components/dashboard/ManageCompetitions';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  const isAdmin = true; // update with your role logic later

  const menu = {
    athlete: [
      { id: 'profile', label: 'Profile' },
      { id: 'bio', label: 'Bio' },
      { id: 'athlete-competitions', label: 'Athlete Competitions' },
      { id: 'athlete-performance', label: 'Athlete Performance' },
    ],
    competition: [
      { id: 'my-competitions', label: 'My Competitions' },
      { id: 'new-competition', label: 'New Competition' },
    ],
    admin: [
      { id: 'manage-athletes', label: 'Manage Athletes' },
      { id: 'manage-competitions', label: 'Manage Competitions' },
    ],
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <Profile />;
      case 'bio': return <Bio />;
      case 'athlete-competitions': return <AthleteCompetitions />;
      case 'athlete-performance': return <AthletePerformance />;
      case 'my-competitions': return <MyCompetitions />;
      case 'new-competition': return <NewCompetition />;
      case 'manage-athletes': return <ManageAthletes />;
      case 'manage-competitions': return <ManageCompetitions />;
      default: return <p className="p-4">Select a dashboard item from the menu.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0D1117] min-h-screen p-4 text-sm font-medium">
          <div className="mb-6">
            <h3 className="text-[#00FF00] text-xs font-bold uppercase tracking-widest mb-2">Athlete Menu</h3>
            {menu.athlete.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`block w-full text-left px-3 py-2 mb-1 rounded transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#00FF00] text-black font-bold'
                    : 'bg-[#161B22] hover:bg-[#222] text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-[#00FF00] text-xs font-bold uppercase tracking-widest mb-2">Competition Menu</h3>
            {menu.competition.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`block w-full text-left px-3 py-2 mb-1 rounded transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#00FF00] text-black font-bold'
                    : 'bg-[#161B22] hover:bg-[#222] text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {isAdmin && (
            <div>
              <h3 className="text-[#00FF00] text-xs font-bold uppercase tracking-widest mb-2">Admin Menu</h3>
              {menu.admin.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`block w-full text-left px-3 py-2 mb-1 rounded transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#00FF00] text-black font-bold'
                      : 'bg-[#161B22] hover:bg-[#222] text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          <h2 className="text-3xl font-bold mb-6 uppercase tracking-wider">{activeTab.replace('-', ' ')}</h2>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
