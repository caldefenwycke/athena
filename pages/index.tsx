// /pages/index.tsx
import Layout from '../components/Layout';

export default function HomePage() {
  return (
    <Layout>
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-500 mb-4">ATHENA</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome to Athena</h2>
        <p className="text-gray-300 max-w-xl text-center">
          Explore competitions, manage athletes, and run strongman events with ease.
        </p>
      </div>
    </Layout>
  );
}
