import './i18n';
import './styles/global.css';
import { ChillModeProvider } from './context/ChillModeContext';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import ParticleBackground from './components/ParticleBackground/ParticleBackground';
import ChillModeToggle from './components/ChillModeToggle/ChillModeToggle';

function App() {
  return (
    <ChillModeProvider>
      {/* Background effects */}
      <div className="grid-bg" />
      <div className="scanlines" />
      <ParticleBackground />

      {/* Chill mode toggle */}
      <ChillModeToggle />

      {/* Main content */}
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </ChillModeProvider>
  );
}

export default App;
