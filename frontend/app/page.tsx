import Link from "next/link";

import Header from'./components/Header';
import Hero from './components/Hero';
import HowItWorksCard from './components/HowItWorksCard';
import CapabilitiesCard from './components/CapabilitiesCard';
import Footer from './components/Footer';


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 text-gray-900">

      {/* Header */}

      <Header />


      {/* Hero */}
      <Hero />

      {/* How It Works */}
      <HowItWorksCard />


      {/* Capabilities */}
      <CapabilitiesCard/>
      

      {/* Footer */}
      <Footer/>
      

    </main>
  );
}
