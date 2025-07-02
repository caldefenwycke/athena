'use client';

import { useEffect, useState } from 'react';

export default function ShowTimeOverview() {
  const [startTime] = useState(new Date('2025-06-21T19:15:00')); // Mocked start time
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPaused, setIsPaused] = useState(false);

  const registeredAthletes = 12;
  const checkedInAthletes = 9;
  const totalEvents = 5;
  const completedEvents = 2;

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const duration = Math.floor((currentTime.getTime() - startTime.getTime()) / 60000);
  const progress = Math.round((completedEvents / totalEvents) * 100);

  return (
    <div className="p-6 bg-[#111] text-white rounded-lg border border-[#2a2a2a]">
      <h1 className="text-3xl font-bold mb-4">ShowTime Overview</h1>

      <div className="mb-4 space-y-2">
        <button className="bg-[#00FF00] text-black px-4 py-2 rounded font-bold">Start Competition</button>
        <button className="bg-[#333] text-white px-4 py-2 rounded ml-2">Pause</button>
        <button className="bg-[#333] text-white px-4 py-2 rounded ml-2">Restart</button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-gray-400">Time Started:</p>
          <p>{startTime.toLocaleTimeString()}</p>
        </div>

        <div>
          <p className="text-gray-400">Duration:</p>
          <p>{duration} minutes</p>
        </div>

        <div>
          <p className="text-gray-400">Competition Phase:</p>
          <p>Ongoing</p>
        </div>

        <div>
          <p className="text-gray-400">Next Scheduled Event:</p>
          <p>Atlas Stones at 20:45</p>
        </div>

        <div>
          <p className="text-gray-400">Active Event:</p>
          <p>Car Deadlift for Reps</p>
        </div>

        <div>
          <p className="text-gray-400">Athletes Registered:</p>
          <p>{registeredAthletes}</p>
        </div>

        <div>
          <p className="text-gray-400">Athletes Checked-In:</p>
          <p>{checkedInAthletes}</p>
        </div>

        <div>
          <p className="text-gray-400">Event Progress:</p>
          <div className="w-full bg-gray-700 rounded h-4 mt-1">
            <div
              className="h-4 bg-[#00FF00] rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1">{progress}% Complete</p>
        </div>

        <div>
          <p className="text-gray-400">Last Updated:</p>
          <p>2025-06-21 20:30:25</p>
        </div>

        <div>
          <p className="text-gray-400">Auto-Save Status:</p>
          <p className="text-green-500">Saved</p>
        </div>

        <div>
          <p className="text-gray-400">Weather:</p>
          <p>Partly Cloudy, 19°C</p>
        </div>
      </div>
    </div>
  );
}
