import './i18n';
import './styles/global.css';
import { ChillModeProvider } from './context/ChillModeContext';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Journey from './components/Journey/Journey';
import Skills from './components/Skills/Skills';
import Achievements from './components/Achievements/Achievements';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import ParticleBackground from './components/ParticleBackground/ParticleBackground';
import ChillModeToggle from './components/ChillModeToggle/ChillModeToggle';

export default function App() {
  return (
    <ChillModeProvider>
      <div className="grid-bg" />
      <div className="scanlines" />
      <ParticleBackground />
      <ChillModeToggle />
      <Header />
      <main>
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Achievements />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </ChillModeProvider>
  );
}
