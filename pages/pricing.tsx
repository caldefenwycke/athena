'use client';

import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold text-center mb-6 text-white">
        Athena Organizer Pricing
      </h1>

      <p className="text-lg mb-8 text-center text-gray-300">
        Athena makes running your competition easy, professional, and stress-free.
        You get full control over athlete registration, finances, communication, and live event management — all in one place.
      </p>

      {/* Pricing Card */}
      <div className="bg-[#1f1f1f] border border-[#00FF00] rounded-2xl p-6 mb-10 shadow-lg">
        <h2 className="text-2xl font-semibold mb-2">Simple, Transparent Pricing</h2>
        <p className="text-xl font-bold text-[#00FF00] mb-4">£5 per athlete registration</p>

        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>No monthly fees</li>
          <li>No setup charges</li>
          <li>No hidden costs</li>
          <li>Only pay when athletes register</li>
        </ul>
      </div>

      {/* What's Included */}
      <h2 className="text-2xl font-semibold mb-3 text-[#00FF00]">What’s Included:</h2>
      <ul className="list-disc list-inside space-y-2 mb-10 text-gray-300">
        <li>Full competition dashboard access</li>
        <li>Customizable athlete registration forms</li>
        <li>Secure online payments with Stripe</li>
        <li>Real-time athlete roster management</li>
        <li>Financial tracking and reporting</li>
        <li>Integrated communication tools <span className="italic text-sm text-gray-500">(coming soon)</span></li>
        <li>Live scoring and leaderboard features <span className="italic text-sm text-gray-500">(coming soon)</span></li>
      </ul>

      {/* Fee Options */}
      <h2 className="text-2xl font-semibold mb-3 text-[#00FF00]">Who Pays the Fee?</h2>
      <p className="mb-2 text-gray-300">You get to choose:</p>
      <ul className="list-disc list-inside space-y-2 mb-10 text-gray-300">
        <li><strong>Option 1:</strong> Pass it on to athletes – The £5 is added at checkout on top of your set registration fee.</li>
        <li><strong>Option 2:</strong> Absorb it yourself – You include it within your registration price. Athena deducts £5 per athlete before your payout.</li>
      </ul>

      {/* Example */}
      <h2 className="text-2xl font-semibold mb-3 text-[#00FF00]">Example Scenario:</h2>
      <div className="bg-[#1f1f1f] border-l-4 border-[#00FF00] rounded-lg p-4 mb-10 text-gray-300">
        <p>Your registration fee: <strong>£50 per athlete</strong></p>
        <p>If you pass the fee on: Athlete pays <strong>£55</strong> at checkout</p>
        <p>If you absorb the fee: Athlete pays <strong>£50</strong>, Athena deducts £5, you receive <strong>£45</strong> (before Stripe fees)</p>
      </div>

      {/* Stripe Info */}
      <h2 className="text-2xl font-semibold mb-3 text-[#00FF00]">What About Stripe Fees?</h2>
      <p className="mb-10 text-gray-300">
        Stripe handles all payment processing. Their standard fees are typically <strong>2.9% + £0.30</strong> per transaction.
        These are automatically deducted by Stripe before your payout.
      </p>

      {/* CTA */}
      <Link href="/dashboard/organizer/stripe-onboarding">
        <div className="text-center py-3 px-6 rounded-lg text-lg font-semibold border border-[#00FF00] text-[#00FF00] hover:bg-[#002200] transition duration-300 shadow-md">
          Connect Your Stripe Account Now →
        </div>
      </Link>

      <p className="text-sm text-gray-400 mt-6 text-center">
        Have questions? Visit your <Link href="/support" className="underline text-[#00FF00]">Support Dashboard</Link> for help.
      </p>
    </div>
  );
}
