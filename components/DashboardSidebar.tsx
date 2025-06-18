import { useState } from 'react';
import Link from 'next/link';

export default function DashboardSidebar() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const sectionClasses = (section: string) =>
    `text-sm uppercase cursor-pointer mb-2 ${
      openSection === section ? 'text-[#00FF00]' : 'text-white'
    }`;

  return (
    <aside className="bg-[#0a0a0a] text-white w-64 min-h-screen px-6 py-8">
      <div>
        {/* Athlete Menu */}
        <h2 className={sectionClasses('athlete')} onClick={() => toggleSection('athlete')}>
          Athlete Menu
        </h2>
        {openSection === 'athlete' && (
          <ul className="mb-6">
            <li><Link href="/dashboard"><span className="block py-1 hover:text-[#00FF00]">Profile</span></Link></li>
            <li><Link href="/dashboard/bio"><span className="block py-1 hover:text-[#00FF00]">Bio</span></Link></li>
            <li><Link href="/dashboard/athlete-competitions"><span className="block py-1 hover:text-[#00FF00]">Athlete Competitions</span></Link></li>
            <li><Link href="/dashboard/athlete-performance"><span className="block py-1 hover:text-[#00FF00]">Athlete Performance</span></Link></li>
          </ul>
        )}

        {/* Competition Menu */}
        <h2 className={sectionClasses('competition')} onClick={() => toggleSection('competition')}>
          Competition Menu
        </h2>
        {openSection === 'competition' && (
          <ul className="mb-6">
            <li><Link href="/dashboard/my-competitions"><span className="block py-1 hover:text-[#00FF00]">My Competitions</span></Link></li>
            <li><Link href="/dashboard/new-competition"><span className="block py-1 hover:text-[#00FF00]">New Competition</span></Link></li>
          </ul>
        )}

        {/* Sponsor Menu */}
        <h2 className={sectionClasses('sponsor')} onClick={() => toggleSection('sponsor')}>
          Sponsor Menu
        </h2>
        {openSection === 'sponsor' && (
          <ul className="mb-6">
            <li><Link href="/dashboard/sponsorships"><span className="block py-1 hover:text-[#00FF00]">Sponsorships</span></Link></li>
          </ul>
        )}

        {/* Admin Menu */}
        <h2 className={sectionClasses('admin')} onClick={() => toggleSection('admin')}>
          Admin Menu
        </h2>
        {openSection === 'admin' && (
          <ul className="">
            <li><Link href="/dashboard/manage-athletes"><span className="block py-1 hover:text-[#00FF00]">Manage Athletes</span></Link></li>
            <li><Link href="/dashboard/manage-competitions"><span className="block py-1 hover:text-[#00FF00]">Manage Competitions</span></Link></li>
          </ul>
        )}
      </div>
    </aside>
  );
}
