'use client';

import React from 'react';
import { ListChecks } from 'lucide-react';

interface Event {
  name: string;
  scoring: string;
}

interface EventsTabProps {
  competition: any;
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
  addEvent: () => void;
  removeEvent: (index: number) => void;
  updateEvent: (index: number, field: string, value: string) => void;
  markDirty: () => void;
}

const EventsTab: React.FC<EventsTabProps> = ({
  competition,
  setCompetition,
  addEvent,
  removeEvent,
  updateEvent,
  markDirty,
}) => {
  const events = competition.settings?.events?.events || [];
  const scoringSystem = competition.settings?.events?.scoringSystem || '';
  const customPoints = competition.settings?.events?.customPoints || [];

  const update = (field: string, value: any) => {
    setCompetition((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        events: {
          ...prev.settings.events,
          [field]: value,
        },
      },
    }));
    markDirty(); // ✅ Autosave
  };

  const updateCustomPoint = (i: number, value: number) => {
    const updated = [...customPoints];
    updated[i] = value;
    update('customPoints', updated);
    markDirty(); // ✅ Autosave
  };

  const addCustomPoint = () => {
    update('customPoints', [...customPoints, 0]);
    markDirty(); // ✅ Autosave
  };

  const removeCustomPoint = (i: number) => {
    const updated = [...customPoints];
    updated.splice(i, 1);
    update('customPoints', updated);
    markDirty(); // ✅ Autosave
  };

  const handleEventChange = (index: number, field: string, value: string) => {
    updateEvent(index, field, value);
    markDirty(); // ✅ Autosave
  };

  return (
    <div className="space-y-6 max-w-4xl p-6 text-white">
      <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
        <ListChecks size={20} className="text-[#00FF00]" />
        Events
      </h2>

      <button
        onClick={() => {
          addEvent();
          markDirty(); // ✅ Autosave
        }}
        className="bg-[#00FF00] text-black px-4 py-2 rounded font-semibold hover:bg-[#00cc00]"
      >
        Add Event
      </button>

      {events.map((event: Event, index: number) => (
        <div key={index} className="p-4 border border-[#333] rounded bg-[#1a1a1a] space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Event {index + 1}</h3>
            <button
              onClick={() => {
                removeEvent(index);
                markDirty(); // ✅ Autosave
              }}
              className="text-red-400 hover:text-red-600"
            >
              Remove
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Event Name</label>
            <input
              type="text"
              value={event.name}
              onChange={(e) => handleEventChange(index, 'name', e.target.value)}
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Scoring Format</label>
            <select
              value={event.scoring}
              onChange={(e) => handleEventChange(index, 'scoring', e.target.value)}
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
            >
              <option value="Reps">Reps (Higher reps win)</option>
              <option value="Distance">Distance (Longer distance wins)</option>
              <option value="WeightKg">Weight (Kg)</option>
              <option value="WeightLbs">Weight (Lbs)</option>
              <option value="TimeFastest">Time (Fastest wins)</option>
              <option value="TimeLongest">Time (Longest wins)</option>
            </select>
          </div>
        </div>
      ))}

      <div>
        <label className="block text-sm text-gray-400 mb-1">Score Calculation Method</label>
        <select
          value={scoringSystem}
          onChange={(e) => update('scoringSystem', e.target.value)}
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
        >
          <option value="">Select a Scoring Method</option>
          <option value="AthleteCount">Athlete Count</option>
          <option value="CustomPoints">Custom Points Per Place</option>
          <option value="Linear10to1">Linear 10 to 1</option>
          <option value="PercentBased">Percent-Based</option>
          <option value="Manual">Manual Scoring</option>
        </select>
      </div>

      {scoringSystem === 'CustomPoints' && (
        <div className="space-y-2 mt-4 p-4 border border-[#333] bg-[#1a1a1a] rounded">
          <h4 className="text-white font-semibold">Custom Points Per Place</h4>
          {customPoints.map((point: number, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <label className="text-gray-400 text-sm w-24">Place {index + 1}:</label>
              <input
                type="number"
                value={point}
                onChange={(e) =>
                  updateCustomPoint(index, parseInt(e.target.value, 10) || 0)
                }
                className="w-20 bg-[#222] border border-[#333] rounded px-2 py-1 text-white"
              />
              <button
                onClick={() => removeCustomPoint(index)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addCustomPoint}
            className="text-green-400 hover:text-green-600 text-sm mt-2"
          >
            + Add Place
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsTab;




