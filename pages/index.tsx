import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <section className="text-center mt-20">
        <h1 className="text-4xl font-bold mb-4 text-green-400">Welcome to ATHENA</h1>
        <p className="text-lg mb-6 text-gray-300">
          Explore competitions, manage athletes, and run strongman events with ease.
        </p>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search competitions..."
            className="w-full max-w-md p-3 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
      </section>
    </Layout>
  );
}
