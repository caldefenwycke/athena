// components/dashboard/competition/settings/tabs/EventTab.tsx
import React from 'react';

interface Division {
  name: string;
  weights: string;
}

interface Event {
  name: string;
  scoring: string;
  divisions: Division[];
}

interface EventTabProps {
  competition: {
    events: Event[];
  };
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
  addEvent: () => void;
  removeEvent: (index: number) => void;
  updateEvent: (index: number, field: string, value: any) => void;
  addDivision: (eventIndex: number) => void;
  updateDivision: (
    eventIndex: number,
    divisionIndex: number,
    field: string,
    value: any
  ) => void;
  removeDivision: (eventIndex: number, divisionIndex: number) => void;
}

const EventTab: React.FC<EventTabProps> = ({
  competition,
  setCompetition,
  addEvent,
  removeEvent,
  updateEvent,
  addDivision,
  updateDivision,
  removeDivision
}) => {
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
              <option value="Points">Points</option>
              <option value="Time">Time</option>
              <option value="Reps">Reps</option>
              <option value="Distance">Distance</option>
              <option value="Weight">Weight</option>
            </select>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm text-gray-400">Divisions</h4>
            <button
              onClick={() => addDivision(eventIndex)}
              className="text-green-400 hover:text-green-600 text-sm"
            >
              + Add Division
            </button>

            {event.divisions.map((div, divIndex) => (
              <div
                key={divIndex}
                className="border border-[#444] rounded p-3 space-y-2 bg-[#222]"
              >
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm font-medium">
                    Division {divIndex + 1}
                  </span>
                  <button
                    onClick={() => removeDivision(eventIndex, divIndex)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Division Name"
                  value={div.name}
                  onChange={(e) =>
                    updateDivision(eventIndex, divIndex, 'name', e.target.value)
                  }
                  className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white"
                />

                <input
                  type="text"
                  placeholder="Weight(s) (e.g. 80kg, 100kg, etc)"
                  value={div.weights}
                  onChange={(e) =>
                    updateDivision(eventIndex, divIndex, 'weights', e.target.value)
                  }
                  className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventTab;
