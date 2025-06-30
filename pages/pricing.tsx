'use client';

import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Athena Organizer Pricing</h1>

      <p className="text-lg mb-4">
        Athena makes running your competition easy, professional, and stress-free.
        You get full control over athlete registration, finances, communication, and live event management — all in one place.
      </p>

      <div className="bg-[#1f1f1f] border border-[#00FF00] rounded-lg p-6 mb-8 shadow-md">
        <h2 className="text-2xl font-semibold mb-2 text-white">Simple, Transparent Pricing</h2>
        <p className="text-xl font-bold mb-4" style={{ color: '#00FF00' }}>£5 per athlete registration</p>

        <ul className="list-disc list-inside space-y-1 text-base">
          <li>No monthly fees</li>
          <li>No setup charges</li>
          <li>No hidden costs</li>
          <li>Only pay when athletes register</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mb-3" style={{ color: '#00FF00' }}>What’s Included:</h2>
      <ul className="list-disc list-inside space-y-1 mb-6">
        <li>Full competition dashboard access</li>
        <li>Customizable athlete registration forms</li>
        <li>Secure online payments with Stripe</li>
        <li>Real-time athlete roster management</li>
        <li>Financial tracking and reporting</li>
        <li>Integrated communication tools (coming soon)</li>
        <li>Live scoring and leaderboard features (coming soon)</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3" style={{ color: '#00FF00' }}>Who Pays the Fee?</h2>
      <p className="mb-2">You get to choose:</p>
      <ul className="list-disc list-inside space-y-1 mb-6">
        <li>Option 1: Pass it on to athletes – The £5 is added at checkout on top of your set registration fee.</li>
        <li>Option 2: Absorb it yourself – You include it within your registration price. Athena deducts £5 per athlete before your payout.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3" style={{ color: '#00FF00' }}>Example Scenario:</h2>
      <div className="bg-[#1f1f1f] border-l-4" style={{ borderColor: '#00FF00' }}>
        <div className="p-4">
          <p>Your registration fee: £50 per athlete</p>
          <p>If you pass the fee on: Athlete pays £55 at checkout</p>
          <p>If you absorb the fee: Athlete pays £50, Athena deducts £5, you receive £45 (before Stripe fees)</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-3 mt-6" style={{ color: '#00FF00' }}>What About Stripe Fees?</h2>
      <p className="mb-6">
        Stripe handles all payment processing. Their standard fees are typically 2.9% + £0.30 per transaction.
        These are automatically deducted by Stripe before your payout.
      </p>

      <Link href="/dashboard/organizer/stripe-onboarding">
        <div
          className="text-center py-3 px-6 rounded-lg text-lg font-semibold shadow-md transition duration-300"
          style={{ backgroundColor: '#1f1f1f', color: '#00FF00', border: '1px solid #00FF00' }}
        >
          Connect Your Stripe Account Now →
        </div>
      </Link>

      <p className="text-sm text-gray-400 mt-4">
        Have questions? Visit your <Link href="/support" className="underline" style={{ color: '#00FF00' }}>Support Dashboard</Link> for help.
      </p>
    </div>
  );
}



