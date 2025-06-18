// components/Sidebar.tsx
import React from 'react';

export default function Sidebar() {
  return (
    <aside className="bg-[#111] text-white w-64 min-h-screen p-6 space-y-8">
      <div>
        <h2 className="text-sm text-[#00FF00] font-bold mb-2">ATHLETE MENU</h2>
        <ul className="space-y-2">
          <li><button className="w-full text-left px-3 py-2 rounded bg-[#00FF00] text-black font-semibold">Profile</button></li>
          <li><button className="w-full text-left px-3 py-2 rounded hover:bg-[#222] transition-colors">Bio</button></li>
          <li><button className="w-full text-left px-3 py-2 rounded hover:bg-[#222] transition-colors">Athlete Competitions</button></li>
          <li><button className="w-full text-left px-3 py-2 rounded hover:bg-[#222] transition-colors">Athlete Performance</button></li>
        </ul>
      </div>

      <div>
        <h2 className="text-sm text-[#00FF00] font-bold mb-2">COMPETITION MENU</h2>
        <ul className="space-y-2">
          <li><button className="w-full text-left px-3 py-2 rounded hover:bg-[#222] transition-colors">My Competitions</button></li>
          <li><button className="w-full text-left px-3 py-2 rounded hover:bg-[#222] transition-colors">New Competition</button></li>
        </ul>
      </div>

      <div>
        <h2 className="text-sm text-[#00FF00] font-bold mb-2">ADMIN MENU</h2>
        <ul className="space-y-2">
          <li><button className="w-full text-left px-3 py-2 rounded hover:bg-[#222] transition-colors">Manage Athletes</button></li>
          <li><button className="w-full text-left px-3 py-2 rounded hover:bg-[#222] transition-colors">Manage Competitions</button></li>
        </ul>
      </div>
    </aside>
  );
}
