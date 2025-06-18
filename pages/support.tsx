// pages/support.tsx
import Head from 'next/head';
import Header from '@/components/Header';

export default function SupportPage() {
  return (
    <>
      <Head>
        <title>Support – ATHENA</title>
      </Head>
      <div className="min-h-screen bg-black text-white">
        <Header />

        <main className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-4">
            <span className="text-[#00FF00]">ATH</span>ENA Support
          </h1>
          <p className="text-center text-gray-400 mb-12">
            Need help? We’re here to support athletes and competition organizers.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">📩 Submit a Support Ticket</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#00FF00]"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#00FF00]"
              />
              <textarea
                placeholder="Describe your issue..."
                rows={6}
                className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#00FF00]"
              />
              <button
                type="submit"
                className="bg-[#00FF00] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#00DD00] transition"
              >
                Submit Ticket
              </button>
            </form>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">📚 Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-[#00FF00] font-semibold">How do I register for a competition?</h3>
                <p className="text-gray-300">Navigate to the competition page and click "Join Now". You’ll need to be signed in to register.</p>
              </div>
              <div>
                <h3 className="text-[#00FF00] font-semibold">Can I edit my competition details?</h3>
                <p className="text-gray-300">Yes. Organizers can manage all details via the dashboard’s competition settings tab.</p>
              </div>
              <div>
                <h3 className="text-[#00FF00] font-semibold">How do I contact the organizer?</h3>
                <p className="text-gray-300">Use the message tool under the competition’s communication tab.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
