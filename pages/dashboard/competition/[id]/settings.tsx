// pages/dashboard/competition/[id]/settings.tsx
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const tabLabels = ['Basic', 'Branding', 'Athlete', 'Event', 'Rules', 'Financial', 'Legal', 'Sponsorship'] as const;
type Tab = (typeof tabLabels)[number];

interface Division {
  name: string;
  weights: string;
}

interface EventItem {
  name: string;
  scoring: string;
  divisions: Division[];
}

export default function CompetitionSettings() {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState<Tab>('Basic');

  const [competition, setCompetition] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    organiserName: '',
    organiserEmail: '',
    organiserPhone: '',
    image: '',
    registrationCloseDate: '',
    maxAthletes: 0,
    requireTshirtSize: false,
    requireWeightHeight: false,
    allowMen: true,
    allowWomen: false,
    events: [] as EventItem[],
  });

  useEffect(() => {
    if (id) {
      console.log('Loaded competition ID:', id);
    }
  }, [id]);

  const handleSave = () => {
    console.log('Saving competition:', id, competition);
  };

  const addEvent = () => {
    setCompetition({
      ...competition,
      events: [...competition.events, { name: '', scoring: 'Points', divisions: [] }],
    });
  };

  const removeEvent = (index: number) => {
    const updated = [...competition.events];
    updated.splice(index, 1);
    setCompetition({ ...competition, events: updated });
  };

  const updateEvent = (index: number, field: keyof EventItem, value: any) => {
    const updated = [...competition.events];
    (updated[index] as any)[field] = value;
    setCompetition({ ...competition, events: updated });
  };

  const addDivision = (eventIndex: number) => {
    const updated = [...competition.events];
    updated[eventIndex].divisions.push({ name: '', weights: '' });
    setCompetition({ ...competition, events: updated });
  };

  const updateDivision = (eventIndex: number, divIndex: number, field: keyof Division, value: string) => {
    const updated = [...competition.events];
    updated[eventIndex].divisions[divIndex][field] = value;
    setCompetition({ ...competition, events: updated });
  };

  const removeDivision = (eventIndex: number, divIndex: number) => {
    const updated = [...competition.events];
    updated[eventIndex].divisions.splice(divIndex, 1);
    setCompetition({ ...competition, events: updated });
  };

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Competition Settings</h1>
          <Link href="/dashboard/competition/my-competitions">
            <button className="bg-[#00FF00] text-black font-semibold px-4 py-2 rounded hover:bg-[#00cc00]">
              ← Back
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabLabels.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded font-semibold ${
                activeTab === tab ? 'bg-[#00FF00] text-black' : 'bg-[#222] text-white hover:bg-[#333]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4 text-white">
          {activeTab === 'Basic' && (
            <>
              <input
                className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                placeholder="Competition Name"
                value={competition.name}
                onChange={(e) => setCompetition({ ...competition, name: e.target.value })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  className="bg-[#222] border border-[#333] rounded px-3 py-2"
                  placeholder="Start Date"
                  type="date"
                  value={competition.startDate}
                  onChange={(e) => setCompetition({ ...competition, startDate: e.target.value })}
                />
                <input
                  className="bg-[#222] border border-[#333] rounded px-3 py-2"
                  placeholder="End Date"
                  type="date"
                  value={competition.endDate}
                  onChange={(e) => setCompetition({ ...competition, endDate: e.target.value })}
                />
                <input
                  className="bg-[#222] border border-[#333] rounded px-3 py-2"
                  placeholder="Start Time"
                  type="time"
                  value={competition.startTime}
                  onChange={(e) => setCompetition({ ...competition, startTime: e.target.value })}
                />
                <input
                  className="bg-[#222] border border-[#333] rounded px-3 py-2"
                  placeholder="End Time"
                  type="time"
                  value={competition.endTime}
                  onChange={(e) => setCompetition({ ...competition, endTime: e.target.value })}
                />
              </div>
              <input
                className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                placeholder="Location"
                value={competition.location}
                onChange={(e) => setCompetition({ ...competition, location: e.target.value })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  className="bg-[#222] border border-[#333] rounded px-3 py-2"
                  placeholder="Organiser Name"
                  value={competition.organiserName}
                  onChange={(e) => setCompetition({ ...competition, organiserName: e.target.value })}
                />
                <input
                  className="bg-[#222] border border-[#333] rounded px-3 py-2"
                  placeholder="Organiser Email"
                  value={competition.organiserEmail}
                  onChange={(e) => setCompetition({ ...competition, organiserEmail: e.target.value })}
                />
                <input
                  className="bg-[#222] border border-[#333] rounded px-3 py-2"
                  placeholder="Organiser Phone"
                  value={competition.organiserPhone}
                  onChange={(e) => setCompetition({ ...competition, organiserPhone: e.target.value })}
                />
              </div>
            </>
          )}

          {activeTab === 'Branding' && (
            <>
              <label className="block mb-1 text-sm text-gray-400">Competition Image</label>
              <input
                type="file"
                className="bg-[#222] border border-[#333] rounded px-3 py-2 w-full"
              />
            </>
          )}

          {activeTab === 'Athlete' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={competition.registrationCloseDate}
                  onChange={(e) => setCompetition({ ...competition, registrationCloseDate: e.target.value })}
                  className="bg-[#222] border border-[#333] rounded px-3 py-2"
                />
                <input
                  type="number"
                  value={competition.maxAthletes}
                  onChange={(e) => setCompetition({ ...competition, maxAthletes: parseInt(e.target.value) || 0 })}
                  className="bg-[#222] border border-[#333] rounded px-3 py-2"
                  placeholder="Max Athletes"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={competition.requireTshirtSize}
                  onChange={(e) => setCompetition({ ...competition, requireTshirtSize: e.target.checked })}
                />
                Require T-Shirt Sizes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={competition.requireWeightHeight}
                  onChange={(e) => setCompetition({ ...competition, requireWeightHeight: e.target.checked })}
                />
                Require Weight & Height
              </label>
            </>
          )}

          {activeTab === 'Event' && (
            <>
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-400">Allowed Genders:</label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={competition.allowMen}
                    onChange={(e) => setCompetition({ ...competition, allowMen: e.target.checked })}
                  />
                  Men
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={competition.allowWomen}
                    onChange={(e) => setCompetition({ ...competition, allowWomen: e.target.checked })}
                  />
                  Women
                </label>
              </div>

              {competition.events.map((event, index) => (
                <div key={index} className="border border-[#333] p-4 rounded bg-[#1a1a1a]">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Event {index + 1}</h3>
                    <button onClick={() => removeEvent(index)} className="text-red-500 hover:underline">Remove</button>
                  </div>

                  <input
                    placeholder="Event Name"
                    value={event.name}
                    onChange={(e) => updateEvent(index, 'name', e.target.value)}
                    className="w-full mb-2 bg-[#222] border border-[#333] rounded px-3 py-2"
                  />

                  <select
                    value={event.scoring}
                    onChange={(e) => updateEvent(index, 'scoring', e.target.value)}
                    className="w-full mb-4 bg-[#222] border border-[#333] rounded px-3 py-2"
                  >
                    <option value="Points">Points</option>
                    <option value="Time">Time</option>
                    <option value="Distance">Distance</option>
                    <option value="Reps">Reps</option>
                  </select>

                  {event.divisions.map((division, divIndex) => (
                    <div key={divIndex} className="mb-2">
                      <div className="flex gap-2 mb-1">
                        <input
                          placeholder="Division Name"
                          value={division.name}
                          onChange={(e) => updateDivision(index, divIndex, 'name', e.target.value)}
                          className="w-1/2 bg-[#222] border border-[#333] rounded px-3 py-2"
                        />
                        <input
                          placeholder="Weights"
                          value={division.weights}
                          onChange={(e) => updateDivision(index, divIndex, 'weights', e.target.value)}
                          className="w-1/2 bg-[#222] border border-[#333] rounded px-3 py-2"
                        />
                        <button onClick={() => removeDivision(index, divIndex)} className="text-red-500">✕</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addDivision(index)} className="text-[#00FF00] hover:underline mt-2">
                    + Add Division
                  </button>
                </div>
              ))}
              <button
                onClick={addEvent}
                className="mt-4 bg-[#00FF00] text-black px-4 py-2 rounded font-semibold hover:bg-[#00cc00]"
              >
                + Add Event
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleSave}
          className="mt-6 bg-[#00FF00] text-black px-6 py-2 rounded font-semibold hover:bg-[#00cc00]"
        >
          Save Settings
        </button>
      </div>
    </DashboardLayout>
  );
}
