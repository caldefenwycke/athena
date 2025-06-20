import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function AthleteBioPage() {
  const profile = {
    name: 'Callum Page',
    age: '34',
    area: 'Herm Island',
    country: 'Guernsey',
  };

  const [aka, setAka] = useState('');
  const [bioImage, setBioImage] = useState<File | null>(null);
  const [strangeFacts, setStrangeFacts] = useState(['']);
  const [experience, setExperience] = useState(1);
  const [bestLifts, setBestLifts] = useState([{ type: '', weight: '', unit: 'kg', reps: '' }]);
  const [favLifts, setFavLifts] = useState(['']);
  const [familyPets, setFamilyPets] = useState(['']);
  const [sponsors, setSponsors] = useState(['']);
  const [extraInfo, setExtraInfo] = useState('');

  const handleAdd = (setter: any, current: any, template: any = '') =>
    setter([...current, template]);

  const handleRemove = (setter: any, current: any, index: number) => {
    const updated = [...current];
    updated.splice(index, 1);
    setter(updated);
  };

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Athlete Bio</h2>
          <button className="bg-[#00FF00] hover:bg-[#00dd00] text-black font-bold px-4 py-1 rounded">
            Save
          </button>
        </div>

        <div>
          <h3 className="text-[#00FF00] font-semibold mb-4">Profile Information</h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            {['name', 'age', 'area', 'country'].map((key) => (
              <div key={key}>
                <p className="text-[#00FF00] font-medium capitalize">{key}</p>
                <p className="text-white">{profile[key as keyof typeof profile]}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[#00FF00] font-semibold mb-4">Bio Details</h3>
          <div className="space-y-6 text-sm">

            <div>
              <label className="text-[#00FF00] font-medium block mb-1">A.K.A</label>
              <input value={aka} onChange={(e) => setAka(e.target.value)} className="w-full bg-[#222] border border-[#333] px-3 py-2 rounded text-white" />
            </div>

            <div>
              <label className="text-[#00FF00] font-medium block mb-1">Profile Picture</label>
              <input type="file" onChange={(e) => setBioImage(e.target.files?.[0] || null)} className="text-white" />
            </div>

            <div>
              <label className="text-[#00FF00] font-medium block mb-1">Strange Facts</label>
              {strangeFacts.map((fact, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input value={fact} onChange={(e) => {
                    const updated = [...strangeFacts];
                    updated[idx] = e.target.value;
                    setStrangeFacts(updated);
                  }} className="w-full bg-[#222] border border-[#333] px-3 py-2 rounded text-white" />
                  <button onClick={() => handleRemove(setStrangeFacts, strangeFacts, idx)} className="text-red-500">−</button>
                </div>
              ))}
              <button onClick={() => handleAdd(setStrangeFacts, strangeFacts)} className="text-[#00FF00]">+ Add</button>
            </div>

            <div>
              <label className="text-[#00FF00] font-medium block mb-1">Experience (Years)</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setExperience((prev) => Math.max(0, prev - 1))} className="bg-[#333] text-white px-2 py-1 rounded">−</button>
                <input type="number" min={0} value={experience} onChange={(e) => setExperience(Number(e.target.value))} className="w-20 text-center bg-[#222] border border-[#333] px-2 py-1 rounded text-white" />
                <button onClick={() => setExperience((prev) => prev + 1)} className="bg-[#333] text-white px-2 py-1 rounded">+</button>
              </div>
            </div>

            <div>
              <label className="text-[#00FF00] font-medium block mb-1">Personal Best Lifts</label>
              {bestLifts.map((lift, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-2 mb-2 w-full">
                  <input
                    placeholder="Type"
                    value={lift.type}
                    onChange={(e) => {
                      const updated = [...bestLifts];
                      updated[idx].type = e.target.value;
                      setBestLifts(updated);
                    }}
                    className="basis-[40%] bg-[#222] border border-[#333] px-2 py-1 rounded text-white"
                  />
                  <input
                    placeholder="Weight"
                    value={lift.weight}
                    onChange={(e) => {
                      const updated = [...bestLifts];
                      updated[idx].weight = e.target.value;
                      setBestLifts(updated);
                    }}
                    className="basis-[20%] bg-[#222] border border-[#333] px-2 py-1 rounded text-white"
                  />
                  <select
                    value={lift.unit}
                    onChange={(e) => {
                      const updated = [...bestLifts];
                      updated[idx].unit = e.target.value;
                      setBestLifts(updated);
                    }}
                    className="basis-[10%] bg-[#222] border border-[#333] px-2 py-1 rounded text-white"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                  <input
                    placeholder="Reps"
                    value={lift.reps}
                    onChange={(e) => {
                      const updated = [...bestLifts];
                      updated[idx].reps = e.target.value;
                      setBestLifts(updated);
                    }}
                    className="basis-[20%] bg-[#222] border border-[#333] px-2 py-1 rounded text-white"
                  />
                  <button onClick={() => handleRemove(setBestLifts, bestLifts, idx)} className="text-red-500">−</button>
                </div>
              ))}
              <button onClick={() => handleAdd(setBestLifts, bestLifts, { type: '', weight: '', unit: 'kg', reps: '' })} className="text-[#00FF00]">+ Add</button>
            </div>

            <div>
              <label className="text-[#00FF00] font-medium block mb-1">Favourite Lifts</label>
              {favLifts.map((lift, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input value={lift} onChange={(e) => {
                    const updated = [...favLifts];
                    updated[idx] = e.target.value;
                    setFavLifts(updated);
                  }} className="w-full bg-[#222] border border-[#333] px-3 py-2 rounded text-white" />
                  <button onClick={() => handleRemove(setFavLifts, favLifts, idx)} className="text-red-500">−</button>
                </div>
              ))}
              <button onClick={() => handleAdd(setFavLifts, favLifts)} className="text-[#00FF00]">+ Add</button>
            </div>

            <div>
              <label className="text-[#00FF00] font-medium block mb-1">Family / Pets</label>
              {familyPets.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input value={item} onChange={(e) => {
                    const updated = [...familyPets];
                    updated[idx] = e.target.value;
                    setFamilyPets(updated);
                  }} className="w-full bg-[#222] border border-[#333] px-3 py-2 rounded text-white" />
                  <button onClick={() => handleRemove(setFamilyPets, familyPets, idx)} className="text-red-500">−</button>
                </div>
              ))}
              <button onClick={() => handleAdd(setFamilyPets, familyPets)} className="text-[#00FF00]">+ Add</button>
            </div>

            <div>
              <label className="text-[#00FF00] font-medium block mb-1">Sponsors</label>
              {sponsors.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input value={s} onChange={(e) => {
                    const updated = [...sponsors];
                    updated[idx] = e.target.value;
                    setSponsors(updated);
                  }} className="w-full bg-[#222] border border-[#333] px-3 py-2 rounded text-white" />
                  <button onClick={() => handleRemove(setSponsors, sponsors, idx)} className="text-red-500">−</button>
                </div>
              ))}
              <button onClick={() => handleAdd(setSponsors, sponsors)} className="text-[#00FF00]">+ Add</button>
            </div>

            <div>
              <label className="text-[#00FF00] font-medium block mb-1">Extra Info</label>
              <textarea value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} rows={4} className="w-full bg-[#222] border border-[#333] px-3 py-2 rounded text-white" />
            </div>
          </div>
        </div>

        {/* Competition Summary (Updated Layout) */}
        <div>
          <h3 className="text-[#00FF00] font-semibold mb-4">Competition Summary</h3>
          <p className="text-sm text-gray-400 mb-4">Automatically populated from your competition records and performance history.</p>

          {/* Row 1: Total + Average */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
            <div className="bg-[#222] p-4 rounded border border-[#333]">
              <p className="text-[#00FF00] font-medium">Total Competitions</p>
              <p className="text-white">Coming soon...</p>
            </div>
            <div className="bg-[#222] p-4 rounded border border-[#333]">
              <p className="text-[#00FF00] font-medium">Average Score</p>
              <p className="text-white">Coming soon...</p>
            </div>
          </div>

          {/* Row 2: Performance Highlights */}
          <div className="bg-[#222] p-4 rounded border border-[#333] mb-4">
            <p className="text-[#00FF00] font-medium">Top Performance Highlights</p>
            <ul className="text-white list-disc list-inside space-y-1 mt-1">
              <li>Coming soon...</li>
            </ul>
          </div>

          {/* Row 3: Upcoming Competitions */}
          <div className="bg-[#222] p-4 rounded border border-[#333]">
            <p className="text-[#00FF00] font-medium">Upcoming Competitions</p>
            <p className="text-white">Coming soon...</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
