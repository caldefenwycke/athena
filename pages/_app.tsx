import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '@/components/ui/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-black text-white min-h-screen w-full">
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
