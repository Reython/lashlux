import './index.css';
import { useScrollProgress } from './hooks/useScrollProgress';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { StickyMobileBar } from './components/layout/StickyMobileBar';
import { Hero } from './components/sections/Hero';
import { Portfolio } from './components/sections/Portfolio';
import { About } from './components/sections/About';
import { Pricing } from './components/sections/Pricing';
import { Booking } from './components/sections/Booking';
import { Reviews } from './components/sections/Reviews';

function ScrollProgress() {
  useScrollProgress();
  return <div className="scroll-progress" />;
}

function App() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Portfolio />
        <About />
        <Pricing />
        <Booking />
        <Reviews />
      </main>
      <Footer />
      <StickyMobileBar />
    </>
  );
}

export default App;
