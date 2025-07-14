'use client';

import Head from 'next/head';

export default function SupportPage() {
  return (
    <>
      <Head>
        <title>Support – ATHENA</title>
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-16 text-white">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center mb-4">
          <span className="text-[#00FF00]">ATH</span>ENA Support
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Need help? We’re here to support athletes and competition organizers.
        </p>

        {/* Support Ticket Form */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-[#00FF00]">📩 Submit a Support Ticket</h2>
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF00]"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF00]"
            />
            <textarea
              placeholder="Describe your issue..."
              rows={6}
              className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF00]"
            />
            <button
              type="submit"
              className="bg-[#00FF00] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#00DD00] transition duration-200"
            >
              Submit Ticket
            </button>
          </form>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-[#00FF00]">📚 Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-[#00FF00]">
                How do I register for a competition?
              </h3>
              <p className="text-gray-300">
                Navigate to the competition page and click &quot;Join Now&quot;. You’ll need to be signed in to register.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#00FF00]">
                Can I edit my competition details?
              </h3>
              <p className="text-gray-300">
                Yes. Organizers can manage all details via the dashboard’s competition settings tab.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#00FF00]">
                How do I contact the organizer?
              </h3>
              <p className="text-gray-300">
                Use the message tool under the competition’s communication tab.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
