import Layout from '@/components/Layout';
import { useState } from 'react';
import Profile from '@/components/dashboard/Profile';
import Bio from '@/components/dashboard/Bio';
import AthleteCompetitions from '@/components/dashboard/AthleteCompetitions';
import AthletePerformance from '@/components/dashboard/AthletePerformance';
import MyCompetitions from '@/components/dashboard/MyCompetitions';
import NewCompetition from '@/components/dashboard/NewCompetition';
import ManageAthletes from '@/components/dashboard/ManageAthletes';
import ManageCompetitions from '@/components/dashboard/ManageCompetitions';

const sections = {
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
  ]
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const isAdmin = true;

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
      default: return <p>Select a dashboard item from the menu.</p>;
    }
  };

  return (
    <Layout>
      <div className="flex">
        <aside className="w-64 p-4 bg-gray-900 border-r border-gray-800 min-h-screen space-y-4">
          <h2 className="text-green-400 font-bold text-xl mb-2">Athlete Menu</h2>
          {sections.athlete.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-700 ${activeTab === item.id ? 'bg-gray-700 text-green-300' : 'text-white'}`}>
              {item.label}
            </button>
          ))}

          <h2 className="text-green-400 font-bold text-xl mt-6 mb-2">Competition Menu</h2>
          {sections.competition.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-700 ${activeTab === item.id ? 'bg-gray-700 text-green-300' : 'text-white'}`}>
              {item.label}
            </button>
          ))}

          {isAdmin && (
            <>
              <h2 className="text-green-400 font-bold text-xl mt-6 mb-2">Admin Menu</h2>
              {sections.admin.map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-700 ${activeTab === item.id ? 'bg-gray-700 text-green-300' : 'text-white'}`}>
                  {item.label}
                </button>
              ))}
            </>
          )}
        </aside>
        <main className="flex-1 p-6 text-white bg-black">
          <h1 className="text-2xl font-bold mb-4 capitalize">{activeTab.replace('-', ' ')}</h1>
          <div>{renderContent()}</div>
        </main>
      </div>
    </Layout>
  );
}
