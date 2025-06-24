import React from 'react';

interface OverviewTabProps {
  competition: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ competition }) => {
  return (
    <div className="space-y-6 text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Competition Overview</h2>

      <section>
        <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
        <p><strong>Name:</strong> {competition.name}</p>
        <p><strong>Location:</strong> {competition.location}</p>
        <p><strong>Start Date:</strong> {competition.startDate}</p>
        <p><strong>End Date:</strong> {competition.endDate}</p>
      </section>

      {competition.image && (
        <section>
          <h3 className="text-xl font-semibold mb-2">Image Preview</h3>
          <img src={competition.image} alt="Competition" className="rounded max-w-md border border-[#333]" />
        </section>
      )}

      <section>
        <h3 className="text-xl font-semibold mb-2">Athlete Requirements</h3>
        <p><strong>Registration Close:</strong> {competition.registrationCloseDate}</p>
        <p><strong>Max Athletes:</strong> {competition.maxAthletes}</p>
        <p><strong>Require T-Shirt Size:</strong> {competition.requireTshirtSize ? 'Yes' : 'No'}</p>
        <p><strong>Require Weight/Height:</strong> {competition.requireWeightHeight ? 'Yes' : 'No'}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Events</h3>
        {competition.events.length === 0 ? (
          <p className="text-gray-400">No events added yet.</p>
        ) : (
          <div className="space-y-4">
            {competition.events.map((event: any, idx: number) => (
              <div key={idx} className="border border-[#333] p-4 rounded">
                <p><strong>Event:</strong> {event.name}</p>
                <p><strong>Scoring:</strong> {event.scoring}</p>
                {event.divisions?.map((div: any, i: number) => (
                  <p key={i} className="text-sm text-gray-300">
                    <strong>Division:</strong> {div.name} — {div.weights}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Rules & Sanctioning</h3>
        <p><strong>Sanctioning Body:</strong> {competition.sanctioningBody}</p>
        <p><strong>Tie Breaker Rule:</strong> {competition.tieBreakerRule}</p>
        <p><strong>Rules Document:</strong> {competition.rulesDoc || 'None uploaded'}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Waiver</h3>
        <p><strong>Waiver Type:</strong> {competition.waiverType === 'athena' ? 'Athena Default' : 'Custom'}</p>
        {competition.waiverType === 'custom' && (
          <>
            <p><strong>Use Template Waiver:</strong> {competition.useTemplateWaiver ? 'Yes' : 'No'}</p>
            <p><strong>Custom Waiver Text:</strong> <br />{competition.customWaiver}</p>
          </>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Financials</h3>
        <p><strong>Registration Cost:</strong> £{competition.registrationCost}</p>
        <p><strong>Prize Purse:</strong> £{competition.prizePurse}</p>
        <p><strong>Extra Shirt Option:</strong> {competition.extraTshirtOption ? 'Yes' : 'No'}</p>
      </section>

      {(competition.sponsorName || competition.sponsorLogo) && (
        <section>
          <h3 className="text-xl font-semibold mb-2">Sponsor</h3>
          <p><strong>Name:</strong> {competition.sponsorName}</p>
          {competition.sponsorLogo && (
            <img src={competition.sponsorLogo} alt="Sponsor Logo" className="max-w-xs border border-[#333] rounded mt-2" />
          )}
        </section>
      )}
    </div>
  );
};

export default OverviewTab;
