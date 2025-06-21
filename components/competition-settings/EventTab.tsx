import React from 'react';

interface TabProps {
  competition: any;
  setCompetition: (value: any) => void;
  addEvent: () => void;
  removeEvent: (index: number) => void;
  updateEvent: (index: number, field: string, value: any) => void;
  addDivision: (eventIndex: number) => void;
  removeDivision: (eventIndex: number, divIndex: number) => void;
  updateDivision: (eventIndex: number, divIndex: number, field: string, value: any) => void;
}

const EventTab: React.FC<TabProps> = ({
  competition,
  addEvent,
  removeEvent,
  updateEvent,
  addDivision,
  removeDivision,
  updateDivision
}) => {
  return (
    <div className="space-y-6">
      {competition.events.map((event: any, index: number) => (
        <div
          key={index}
          className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Event {index + 1}</h3>
            <button
              onClick={() => removeEvent(index)}
              className="text-sm text-red-400 hover:underline"
            >
              Remove Event
            </button>
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-400">Event Name</label>
            <input
              type="text"
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
              value={event.name}
              onChange={(e) => updateEvent(index, 'name', e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-400">Scoring Format</label>
            <select
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
              value={event.scoring}
              onChange={(e) => updateEvent(index, 'scoring', e.target.value)}
            >
              <option>Points</option>
              <option>Time</option>
              <option>Reps</option>
              <option>Distance</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-300 font-medium">Divisions</p>
              <button
                onClick={() => addDivision(index)}
                className="text-xs text-green-400 hover:underline"
              >
                Add Division
              </button>
            </div>
            {event.divisions.map((division: any, divIndex: number) => (
              <div key={divIndex} className="bg-[#111] border border-[#333] rounded p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm text-white">Division {divIndex + 1}</h4>
                  <button
                    onClick={() => removeDivision(index, divIndex)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-400">Name</label>
                  <input
                    type="text"
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                    value={division.name}
                    onChange={(e) =>
                      updateDivision(index, divIndex, 'name', e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-400">Weights</label>
                  <input
                    type="text"
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                    value={division.weights}
                    onChange={(e) =>
                      updateDivision(index, divIndex, 'weights', e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={addEvent}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Event
      </button>
    </div>
  );
};

export default EventTab;
