'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface Division {
  name: string;
  gender: string;
  usesWeightClasses: boolean;
  weightClasses: string;
}

interface DivisionsTabProps {
  competition: any;
  setCompetition: (data: any) => void;
  markDirty: () => void;
}

export default function DivisionsTab({ competition, setCompetition, markDirty }: DivisionsTabProps) {
  const divisions = competition.settings?.divisions?.divisions || [];
  const [localDivisions, setLocalDivisions] = useState<Division[]>(divisions);

  useEffect(() => {
    setLocalDivisions(divisions);
  }, [divisions]);

  const handleAddDivision = () => {
    const updated = [
      ...localDivisions,
      { name: '', gender: 'Male', usesWeightClasses: false, weightClasses: '' },
    ];
    setLocalDivisions(updated);
    updateCompetition(updated);
    markDirty(); // ✅ Autosave
  };

  const handleUpdateDivision = (
    index: number,
    field: keyof Division,
    value: string | boolean
  ) => {
    const updated = [...localDivisions];
    updated[index] = { ...updated[index], [field]: value };
    setLocalDivisions(updated);
    updateCompetition(updated);
    markDirty(); // ✅ Autosave
  };

  const handleRemoveDivision = (index: number) => {
    const updated = [...localDivisions];
    updated.splice(index, 1);
    setLocalDivisions(updated);
    updateCompetition(updated);
    markDirty(); // ✅ Autosave
  };

  const updateCompetition = (updatedDivisions: Division[]) => {
    setCompetition((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        divisions: {
          ...prev.settings.divisions,
          divisions: updatedDivisions,
        },
      },
    }));
  };

  return (
    <div className="space-y-6 max-w-3xl p-6 text-white">
      <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
        <Users size={20} className="text-[#00FF00]" />
        Divisions
      </h2>

      {localDivisions.map((division, index) => (
        <div key={index} className="mb-4 border-b border-gray-700 pb-4">
          {/* Division Name */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={division.name}
              onChange={(e) => handleUpdateDivision(index, 'name', e.target.value)}
              placeholder={`Division ${index + 1} Name`}
              className="w-full bg-black text-white border border-gray-600 rounded px-2 py-1 text-sm"
            />
            <button
              onClick={() => handleRemoveDivision(index)}
              className="text-green-500 text-sm hover:text-green-400"
            >
              −
            </button>
          </div>

          {/* Gender and Uses Weight Classes */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <label className="w-16">Gender:</label>
              <select
                value={division.gender}
                onChange={(e) => handleUpdateDivision(index, 'gender', e.target.value)}
                className="bg-black text-white border border-gray-600 rounded px-2 py-1 text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="w-32">Uses Weight Classes:</label>
              <select
                value={division.usesWeightClasses ? 'Yes' : 'No'}
                onChange={(e) =>
                  handleUpdateDivision(index, 'usesWeightClasses', e.target.value === 'Yes')
                }
                className="bg-black text-white border border-gray-600 rounded px-2 py-1 text-sm"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Weight Classes Input - Conditional */}
          {division.usesWeightClasses && (
            <div>
              <label className="block mb-1">Weight Classes (comma separated):</label>
              <input
                type="text"
                value={division.weightClasses}
                onChange={(e) => handleUpdateDivision(index, 'weightClasses', e.target.value)}
                placeholder="e.g., U80, U90, Open"
                className="w-full bg-black text-white border border-gray-600 rounded px-2 py-1 text-sm"
              />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddDivision}
        className="text-[#00FF00] text-sm mt-2"
      >
        + Add Division
      </button>
    </div>
  );
}



