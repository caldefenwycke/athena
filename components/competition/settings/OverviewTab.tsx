'use client';

import React from 'react';
import { LayoutDashboard } from 'lucide-react';

interface OverviewTabProps {
  competition: any;
}

const formatDate = (value: any) => {
  if (value?.toDate) return value.toDate().toLocaleDateString();
  if (typeof value === 'string') return value;
  return '—';
};

const OverviewTab: React.FC<OverviewTabProps> = ({ competition }) => {
  const settings = competition?.settings || {};

  const basic = settings.basic || {};
  const athlete = settings.athlete || {};
  const events = settings.events?.events || [];
  const rules = settings.rules || {};
  const financial = settings.financial || {};
  const sponsorship = settings.sponsorship || {};
  const branding = settings.branding || {};

  const isMostlyEmpty = (
    !basic.name &&
    !athlete.maxAthletes &&
    events.length === 0 &&
    !rules.sanctioningBody &&
    !financial.registrationCost
  );

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 text-[#00FF00] mb-4">
        <LayoutDashboard size={24} />
        <h2 className="text-2xl">Overview</h2>
      </div>

      <div className="bg-[#111] p-6 rounded-lg shadow-lg border border-[#1a1a1a] space-y-8">
        {isMostlyEmpty && (
          <div className="p-4 bg-yellow-900/20 border border-yellow-600 text-yellow-300 rounded">
            This competition has not been configured yet. Please visit the settings tab to begin setup.
          </div>
        )}

        <section>
          <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
          <p><strong>Name:</strong> {basic.name || '—'}</p>
          <p><strong>Location:</strong> {basic.location || '—'}</p>
          <p><strong>Start Date:</strong> {formatDate(basic.startDate)}</p>
          <p><strong>End Date:</strong> {formatDate(basic.endDate)}</p>
        </section>

        {branding.imageUrl && (
          <section>
            <h3 className="text-xl font-semibold mb-2">Image Preview</h3>
            <img
              src={branding.imageUrl}
              alt="Competition"
              className="rounded max-w-md border border-[#333]"
            />
          </section>
        )}

        <section>
          <h3 className="text-xl font-semibold mb-2">Athlete Requirements</h3>
          <p><strong>Registration Close:</strong> {formatDate(athlete.registrationCloseDate)}</p>
          <p><strong>Max Athletes:</strong> {athlete.maxAthletes || '—'}</p>
          <p><strong>Require T-Shirt Size:</strong> {athlete.requireTshirtSize ? 'Yes' : 'No'}</p>
          <p><strong>Require Weight/Height:</strong> {athlete.requireWeightHeight ? 'Yes' : 'No'}</p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Events</h3>
          {events.length === 0 ? (
            <p className="text-gray-400">No events added yet.</p>
          ) : (
            <div className="space-y-4">
              {events.map((event: any, idx: number) => (
                <div key={idx} className="border border-[#333] p-4 rounded">
                  <p><strong>Event:</strong> {event.name || '—'}</p>
                  <p><strong>Scoring:</strong> {event.scoring || '—'}</p>
                  {event.divisions?.length > 0 && event.divisions.map((div: any, i: number) => (
                    <p key={i} className="text-sm text-gray-300">
                      <strong>Division:</strong> {div.name || '—'} — {div.weights || '—'}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Rules & Sanctioning</h3>
          <p><strong>Sanctioning Body:</strong> {rules.sanctioningBody || '—'}</p>
          <p><strong>Tie Breaker Rule:</strong> {rules.tieBreakerRule || '—'}</p>
          <p><strong>Rules Document:</strong> {rules.rulesDoc ? (
            <a
              href={rules.rulesDoc}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-green-400"
            >
              View Document
            </a>
          ) : 'None uploaded'}</p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Waiver</h3>
          <p><strong>Waiver Type:</strong> {rules.waiverType === 'athena' ? 'Athena Default' : rules.waiverType ? 'Custom' : '—'}</p>
          {rules.waiverType === 'custom' && (
            <>
              <p><strong>Use Template Waiver:</strong> {rules.useTemplateWaiver ? 'Yes' : 'No'}</p>
              <p><strong>Custom Waiver Text:</strong><br />{rules.customWaiver || '—'}</p>
            </>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Financials</h3>
          <p><strong>Registration Cost:</strong> £{financial.registrationCost || 0}</p>
          <p><strong>Prize Purse:</strong> £{financial.prizePurse || 0}</p>
          <p><strong>Extra Shirt Option:</strong> {financial.extraTshirtCost ? 'Yes' : 'No'}</p>
        </section>

        {(sponsorship.sponsorName || sponsorship.sponsorLogo) && (
          <section>
            <h3 className="text-xl font-semibold mb-2">Sponsor</h3>
            <p><strong>Name:</strong> {sponsorship.sponsorName || '—'}</p>
            {sponsorship.sponsorLogo && (
              <img
                src={sponsorship.sponsorLogo}
                alt="Sponsor Logo"
                className="max-w-xs border border-[#333] rounded mt-2"
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;

