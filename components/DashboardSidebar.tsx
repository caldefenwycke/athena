// components/DashboardSidebar.tsx
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardSidebar() {
  const [openSections, setOpenSections] = useState({
    athlete: false,
    competition: false,
    sponsor: false,
    admin: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="bg-[#0a0a0a] text-white w-64 min-h-screen px-6 py-8">
      <div>
        {/* Athlete Menu */}
        <h2
          className="text-[#00FF00] font-bold uppercase text-sm mb-2 cursor-pointer"
          onClick={() => toggleSection('athlete')}
        >
          Athlete Menu
        </h2>
        <ul className={`${openSections.athlete ? 'block' : 'hidden'} mb-6`}>
          <li><Link href="/dashboard"><span className="block py-1 hover:text-[#00FF00]">Profile</span></Link></li>
          <li><Link href="/dashboard/bio"><span className="block py-1 hover:text-[#00FF00]">Bio</span></Link></li>
          <li><Link href="/dashboard/athlete-competitions"><span className="block py-1 hover:text-[#00FF00]">Athlete Competitions</span></Link></li>
          <li><Link href="/dashboard/athlete-performance"><span className="block py-1 hover:text-[#00FF00]">Athlete Performance</span></Link></li>
        </ul>

        {/* Competition Menu */}
        <h2
          className="text-[#00FF00] font-bold uppercase text-sm mb-2 cursor-pointer"
          onClick={() => toggleSection('competition')}
        >
          Competition Menu
        </h2>
        <ul className={`${openSections.competition ? 'block' : 'hidden'} mb-6`}>
          <li><Link href="/dashboard/my-competitions"><span className="block py-1 hover:text-[#00FF00]">My Competitions</span></Link></li>
          <li><Link href="/dashboard/new-competition"><span className="block py-1 hover:text-[#00FF00]">New Competition</span></Link></li>
        </ul>

        {/* Sponsor Menu */}
        <h2
          className="text-[#00FF00] font-bold uppercase text-sm mb-2 cursor-pointer"
          onClick={() => toggleSection('sponsor')}
        >
          Sponsor Menu
        </h2>
        <ul className={`${openSections.sponsor ? 'block' : 'hidden'} mb-6`}>
          <li><Link href="/dashboard/sponsorships"><span className="block py-1 hover:text-[#00FF00]">Sponsorships</span></Link></li>
        </ul>

        {/* Admin Menu */}
        <h2
          className="text-[#00FF00] font-bold uppercase text-sm mb-2 cursor-pointer"
          onClick={() => toggleSection('admin')}
        >
          Admin Menu
        </h2>
        <ul className={`${openSections.admin ? 'block' : 'hidden'}`}>
          <li><Link href="/dashboard/manage-athletes"><span className="block py-1 hover:text-[#00FF00]">Manage Athletes</span></Link></li>
          <li><Link href="/dashboard/manage-competitions"><span className="block py-1 hover:text-[#00FF00]">Manage Competitions</span></Link></li>
        </ul>
      </div>
    </aside>
  );
}
