'use client';

import CompetitionPortalLayout from '@/components/layout/CompetitionPortalLayout';
import { MonitorPlay } from 'lucide-react';

export default function ShowTimePage() {
  return (
    <CompetitionPortalLayout>
      <div className="p-8 text-white max-w-6xl mx-auto">
        <h2 className="text-3xl font-normal text-[#00FF00] flex items-center gap-3 mb-8">
          <MonitorPlay size={24} className="text-[#00FF00]" />
          SHOW TIME
        </h2>

        <div className="bg-[#111] border border-[#333] rounded-lg p-6 shadow-lg">
          <p className="text-lg text-gray-300 mb-4">
            Get ready to experience the ultimate in strongman competition presentation.
            <br />
            <span className="text-[#00FF00] font-semibold">Live scoring. Real-time results. Immersive displays.</span>
          </p>

          <p className="text-gray-400 mb-8">
            We’re currently building a cutting-edge visual scoreboard system that will transform the way your audience sees every lift, every second, and every rep. "Show Time" will feature real-time stats, visual timers, and athlete progress tracking — all live.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 flex flex-col justify-center items-center animate-pulse"
              >
                <div className="w-16 h-16 rounded-full bg-[#00FF00]/10 mb-4" />
                <p className="text-sm text-gray-500">Widget {idx + 1}</p>
                <p className="text-[#00FF00] text-sm">Coming Soon</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-md text-gray-500 italic">
              This feature will be available to organisers soon. Stay tuned for updates in your Athena dashboard.
            </p>
          </div>
        </div>
      </div>
    </CompetitionPortalLayout>
  );
}
