import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardSidebar() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const router = useRouter();

  const isActivePath = (href: string) => router.pathname === href;

  const sectionClasses = (section: string) =>
    `text-sm uppercase cursor-pointer mb-2 ${
      openSection === section ? 'text-[#00FF00]' : 'text-white'
    }`;

  const linkClasses = (href: string) =>
    `block py-1 pl-4 border-l ${
      isActivePath(href)
        ? 'border-[#00FF00] text-[#00FF00]'
        : 'border-[#444] text-white hover:text-[#00FF00]'
    }`;

  return (
    <aside className="bg-[#0a0a0a] text-white w-64 min-h-screen px-6 py-8">
      {/* Athlete Menu */}
      <h2 className={sectionClasses('athlete')} onClick={() => setOpenSection(openSection === 'athlete' ? null : 'athlete')}>
        Athlete Menu
      </h2>
      <ul className="mb-4">
        {openSection === 'athlete' && (
          <>
            <li><Link href="/dashboard" className={linkClasses('/dashboard')}>Profile</Link></li>
            <li><Link href="/dashboard/bio" className={linkClasses('/dashboard/bio')}>Bio</Link></li>
            <li><Link href="/dashboard/athlete-competitions" className={linkClasses('/dashboard/athlete-competitions')}>Athlete Competitions</Link></li>
            <li><Link href="/dashboard/athlete-performance" className={linkClasses('/dashboard/athlete-performance')}>Athlete Performance</Link></li>
          </>
        )}
      </ul>

      {/* Competition Menu */}
      <h2 className={sectionClasses('competition')} onClick={() => setOpenSection(openSection === 'competition' ? null : 'competition')}>
        Competition Menu
      </h2>
      <ul className="mb-4">
        {openSection === 'competition' && (
          <>
            <li><Link href="/dashboard/my-competitions" className={linkClasses('/dashboard/my-competitions')}>My Competitions</Link></li>
            <li><Link href="/dashboard/new-competition" className={linkClasses('/dashboard/new-competition')}>New Competition</Link></li>
          </>
        )}
      </ul>

      {/* Sponsor Menu */}
      <h2 className={sectionClasses('sponsor')} onClick={() => setOpenSection(openSection === 'sponsor' ? null : 'sponsor')}>
        Sponsor Menu
      </h2>
      <ul className="mb-4">
        {openSection === 'sponsor' && (
          <li><Link href="/dashboard/sponsorships" className={linkClasses('/dashboard/sponsorships')}>Sponsorships</Link></li>
        )}
      </ul>

      {/* Admin Menu */}
      <h2 className={sectionClasses('admin')} onClick={() => setOpenSection(openSection === 'admin' ? null : 'admin')}>
        Admin Menu
      </h2>
      <ul>
        {openSection === 'admin' && (
          <>
            <li><Link href="/dashboard/manage-athletes" className={linkClasses('/dashboard/manage-athletes')}>Manage Athletes</Link></li>
            <li><Link href="/dashboard/manage-competitions" className={linkClasses('/dashboard/manage-competitions')}>Manage Competitions</Link></li>
          </>
        )}
      </ul>
    </aside>
  );
}
