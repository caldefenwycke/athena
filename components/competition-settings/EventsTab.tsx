// components/dashboard/competition/settings/tabs/EventsTab.tsx
import React from 'react';

interface Event {
  name: string;
  scoring: string;
}

interface EventsTabProps {
  competition: {
    events: Event[];
    scoringSystem: string;
    customPoints?: number[];  // ✅ New field for Custom Points array
  };
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
  addEvent: () => void;
  removeEvent: (index: number) => void;
  updateEvent: (index: number, field: string, value: any) => void;
}

const EventsTab: React.FC<EventsTabProps> = ({
  competition,
  setCompetition,
  addEvent,
  removeEvent,
  updateEvent
}) => {
  const handleScoringSystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompetition((prev) => ({
      ...prev,
      scoringSystem: e.target.value,
      // Reset customPoints if switching away from CustomPoints
      customPoints: e.target.value === 'CustomPoints' ? prev.customPoints || [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] : undefined,
    }));
  };

  const handleCustomPointChange = (index: number, value: number) => {
    const updatedPoints = [...(competition.customPoints || [])];
    updatedPoints[index] = value;
    setCompetition((prev) => ({
      ...prev,
      customPoints: updatedPoints,
    }));
  };

  const addCustomPoint = () => {
    setCompetition((prev) => ({
      ...prev,
      customPoints: [...(prev.customPoints || []), 0],
    }));
  };

  const removeCustomPoint = (index: number) => {
    const updatedPoints = [...(competition.customPoints || [])];
    updatedPoints.splice(index, 1);
    setCompetition((prev) => ({
      ...prev,
      customPoints: updatedPoints,
    }));
  };

  return (
    <div className="space-y-6">
      <button
        onClick={addEvent}
        className="bg-[#00FF00] text-black px-4 py-2 rounded font-semibold hover:bg-[#00cc00]"
      >
        Add Event
      </button>

      {competition.events.map((event, eventIndex) => (
        <div
          key={eventIndex}
          className="p-4 border border-[#333] rounded bg-[#1a1a1a] space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">
              Event {eventIndex + 1}
            </h3>
            <button
              onClick={() => removeEvent(eventIndex)}
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
              onChange={(e) => updateEvent(eventIndex, 'name', e.target.value)}
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Scoring Format</label>
            <select
              value={event.scoring}
              onChange={(e) => updateEvent(eventIndex, 'scoring', e.target.value)}
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
            >
              <option value="Reps">Reps (Higher reps win)</option>
              <option value="Distance">Distance (Longer distance wins)</option>
              <option value="WeightKg">Weight (Kg) (Heavier weight wins)</option>
              <option value="WeightLbs">Weight (lbs) (Heavier weight wins)</option>
              <option value="TimeFastest">Time (Faster time wins)</option>
              <option value="TimeLongest">Time (Longest time wins)</option>
            </select>
          </div>
        </div>
      ))}

      {/* Scoring System Selection */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Score Calculation Method</label>
        <select
          value={competition.scoringSystem || ''}
          onChange={handleScoringSystemChange}
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
        >
          <option value="">Select a Scoring Method</option>
          <option value="AthleteCount">Athlete Count (Descending Points)</option>
          <option value="CustomPoints">Custom Points Per Place</option>
          <option value="Linear10to1">Linear 10 to 1</option>
          <option value="PercentBased">Percent-Based Scoring</option>
          <option value="Manual">Manual Scoring</option>
        </select>
      </div>

      {/* Custom Points Editor */}
      {competition.scoringSystem === 'CustomPoints' && (
        <div className="space-y-2 mt-4 p-4 border border-[#333] bg-[#1a1a1a] rounded">
          <h4 className="text-white font-semibold">Custom Points Per Place</h4>
          {competition.customPoints?.map((point, index) => (
            <div key={index} className="flex items-center space-x-2">
              <label className="text-gray-400 text-sm w-24">Place {index + 1}:</label>
              <input
                type="number"
                value={point}
                onChange={(e) => handleCustomPointChange(index, parseInt(e.target.value, 10) || 0)}
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
