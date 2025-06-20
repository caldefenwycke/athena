import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function NewCompetitionPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with Firestore create logic
    console.log('Creating competition →', form);
  };

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Create New Competition</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-[#00FF00] font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter competition title"
              className="w-full bg-[#222] border border-[#333] rounded px-4 py-2 text-white focus:outline-none focus:border-[#00FF00]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-[#00FF00] font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter competition description"
              rows={4}
              className="w-full bg-[#222] border border-[#333] rounded px-4 py-2 text-white focus:outline-none focus:border-[#00FF00]"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-[#00FF00] font-medium mb-1">
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className="w-full bg-[#222] border border-[#333] rounded px-4 py-2 text-white focus:outline-none focus:border-[#00FF00]"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-[#00FF00] font-medium mb-1">
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                className="w-full bg-[#222] border border-[#333] rounded px-4 py-2 text-white focus:outline-none focus:border-[#00FF00]"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="bg-[#00FF00] hover:bg-[#00dd00] text-black font-bold px-6 py-2 rounded"
            >
              Create Competition
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
