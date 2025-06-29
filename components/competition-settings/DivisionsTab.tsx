'use client';

import { useState, useEffect } from 'react';

interface DivisionsTabProps {
  competition: any;
  setCompetition: (data: any) => void;
}

export default function DivisionsTab({ competition, setCompetition }: DivisionsTabProps) {
  const [localDivisions, setLocalDivisions] = useState<string[]>(competition.divisions || []);

  useEffect(() => {
    setLocalDivisions(competition.divisions || []);
  }, [competition.divisions]);

  const handleAddDivision = () => {
    const updated = [...localDivisions, ''];
    setLocalDivisions(updated);
    setCompetition({ ...competition, divisions: updated });
  };

  const handleUpdateDivision = (index: number, value: string) => {
    const updated = [...localDivisions];
    updated[index] = value;
    setLocalDivisions(updated);
    setCompetition({ ...competition, divisions: updated });
  };

  const handleRemoveDivision = (index: number) => {
    const updated = [...localDivisions];
    updated.splice(index, 1);
    setLocalDivisions(updated);
    setCompetition({ ...competition, divisions: updated });
  };

  return (
    <div className="relative bg-[#111] border border-[#1A1A1A] rounded-lg p-6 text-sm text-white">
      <h3 className="text-2xl font-bold mb-6 text-white">Competition Divisions</h3>

      {localDivisions.map((division, index) => (
        <div key={index} className="mb-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={division}
              onChange={(e) => handleUpdateDivision(index, e.target.value)}
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




