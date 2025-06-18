import Head from 'next/head';

export default function BioPage() {
  return (
    <>
      <Head>
        <title>Bio Page | ATHENA</title>
      </Head>
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold text-[#00FF00] mb-4">Bio Page</h1>
        <p>This is the placeholder for the Bio Page.</p>
      </div>
    </>
  );
}
