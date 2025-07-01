'use client';

import { useState, useEffect } from 'react';

interface Division {
  name: string;
  gender: string;
  usesWeightClasses: boolean;
  weightClasses: string;
}

interface Event {
  name: string;
}

interface WeightsTabProps {
  competition: any;
  setCompetition: (data: any) => void;
}

export default function WeightsTab({ competition, setCompetition }: WeightsTabProps) {
  const [weights, setWeights] = useState<{ [key: string]: { [key: string]: string } }>(
    competition.weights || {}
  );

  const divisions: Division[] = competition.divisions || [];
  const events: Event[] = competition.events || [];

  // Build rows: Each division + weight class (or just division if no weight classes)
  const buildRows = () => {
    const rows: { divisionName: string; weightClass: string }[] = [];

    divisions.forEach((division) => {
      if (division.usesWeightClasses && division.weightClasses) {
        division.weightClasses.split(',').map((weightClass) =>
          rows.push({
            divisionName: division.name,
            weightClass: weightClass.trim(),
          })
        );
      } else {
        rows.push({
          divisionName: division.name,
          weightClass: '',
        });
      }
    });

    return rows;
  };

  const rows = buildRows();

  const handleWeightChange = (
    divisionName: string,
    weightClass: string,
    eventName: string,
    value: string
  ) => {
    const rowKey = `${divisionName}|${weightClass}`;
    const updated = { ...weights };

    if (!updated[rowKey]) {
      updated[rowKey] = {};
    }

    updated[rowKey][eventName] = value;
    setWeights(updated);
    setCompetition({ ...competition, weights: updated });
  };

  return (
    <div className="relative bg-[#111] border border-[#1A1A1A] rounded-lg p-6 text-sm text-white overflow-x-auto">
      <h3 className="text-2xl font-bold mb-6 text-white">Event Weights per Division</h3>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-700 px-2 py-1">Division</th>
            <th className="border border-gray-700 px-2 py-1">Weight Class</th>
            {events.map((event, index) => (
              <th key={index} className="border border-gray-700 px-2 py-1">
                {event.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-gray-700 px-2 py-1">{row.divisionName}</td>
              <td className="border border-gray-700 px-2 py-1">
                {row.weightClass || '-'}
              </td>
              {events.map((event, eventIndex) => {
                const rowKey = `${row.divisionName}|${row.weightClass}`;
                return (
                  <td key={eventIndex} className="border border-gray-700 px-2 py-1">
                    <input
                      type="text"
                      value={weights[rowKey]?.[event.name] || ''}
                      onChange={(e) =>
                        handleWeightChange(row.divisionName, row.weightClass, event.name, e.target.value)
                      }
                      placeholder="Weight"
                      className="w-full bg-black text-white border border-gray-600 rounded px-1 py-0.5 text-xs"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
