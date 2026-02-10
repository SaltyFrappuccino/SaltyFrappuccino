import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronDown, Github, Send, FileCode, ChevronUp } from 'lucide-react';
import './Hero.css';

// Code snippets in different languages
const codeFiles = [
  {
    name: 'developer.ts',
    language: 'TypeScript',
    code: `const developer = {
  name: "Alexander",
  aka: "SaltyFrappuccino",
  age: 21,
  location: "Russia 🇷🇺",
  
  skills: [
    "Fullstack",
    "AI Engineering",
    "System Design"
  ],
  
  currentlyLearning: "∞",
  
  getDrink(): string {
    return "☕ Frappuccino";
  }
};`
  },
  {
    name: 'developer.py',
    language: 'Python',
    code: `developer = {
    "name": "Alexander",
    "aka": "SaltyFrappuccino",
    "age": 21,
    "location": "Russia 🇷🇺",
    
    "skills": [
        "Fullstack",
        "AI Engineering",
        "System Design"
    ],
    
    "currently_learning": "∞",
}

def get_drink() -> str:
    return "☕ Frappuccino"`
  },
  {
    name: 'developer.go',
    language: 'Go',
    code: `type Developer struct {
    Name     string
    Aka      string
    Age      int
    Location string
    Skills   []string
}

var developer = Developer{
    Name:     "Alexander",
    Aka:      "SaltyFrappuccino",
    Age:      21,
    Location: "Russia 🇷🇺",
    Skills:   []string{
        "Fullstack",
        "AI Engineering",
        "System Design",
    },
}

func GetDrink() string {
    return "☕ Frappuccino"
}`
  },
  {
    name: 'Developer.java',
    language: 'Java',
    code: `public class Developer {
    String name = "Alexander";
    String aka = "SaltyFrappuccino";
    int age = 21;
    String location = "Russia 🇷🇺";
    
    String[] skills = {
        "Fullstack",
        "AI Engineering",
        "System Design"
    };
    
    String getDrink() {
        return "☕ Frappuccino";
    }
}`
  },
  {
    name: 'developer.rs',
    language: 'Rust',
    code: `struct Developer {
    name: &'static str,
    aka: &'static str,
    age: u8,
    location: &'static str,
    skills: Vec<&'static str>,
}

const DEVELOPER: Developer = Developer {
    name: "Alexander",
    aka: "SaltyFrappuccino",
    age: 21,
    location: "Russia 🇷🇺",
    skills: vec![
        "Fullstack",
        "AI Engineering",
        "System Design"
    ],
};

fn get_drink() -> &'static str {
    "☕ Frappuccino"
}`
  }
];

export default function Hero() {
  const { t } = useTranslation();
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentFile = codeFiles[selectedFileIndex];

  return (
    <section id="home" className="hero">
      {/* Synthwave Grid Background */}
      <div className="hero-bg">
        <div className="synthwave-grid">
          <div className="grid-lines"></div>
        </div>
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="synthwave-sun" />
      </div>

      <div className="hero-content container">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p
            className="hero-greeting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t('hero.greeting')}
          </motion.p>

          <motion.h1
            className="hero-name glitch"
            data-text={t('hero.nickname')}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t('hero.nickname')}
          </motion.h1>

          <motion.div
            className="hero-role-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="hero-role-prefix">{'>'}</span>
            <span className="hero-role typing-effect">{t('hero.role')}</span>
            <span className="cursor">_</span>
          </motion.div>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              className="btn btn-primary"
              onClick={scrollToProjects}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={20} />
              {t('hero.cta.projects')}
            </motion.button>
            <motion.button
              className="btn btn-secondary"
              onClick={scrollToContact}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send size={20} />
              {t('hero.cta.contact')}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Draggable Code Window with Language Dropdown */}
        <motion.div
          className="hero-decoration"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          drag
          dragConstraints={{ left: -200, right: 200, top: -100, bottom: 100 }}
          dragElastic={0.1}
          whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
          style={{ cursor: 'grab' }}
        >
          <div className="code-window">
            <div className="code-window-header">
              <span className="code-dot red" />
              <span className="code-dot yellow" />
              <span className="code-dot green" />
              
              {/* Language Dropdown */}
              <div className="file-dropdown">
                <button 
                  className="file-dropdown-trigger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                >
                  <FileCode size={14} />
                  <span>{currentFile.name}</span>
                  {isDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                
                {isDropdownOpen && (
                  <motion.div 
                    className="file-dropdown-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {codeFiles.map((file, index) => (
                      <button
                        key={file.name}
                        className={`file-dropdown-item ${index === selectedFileIndex ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFileIndex(index);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <FileCode size={14} />
                        <span className="file-name">{file.name}</span>
                        <span className="file-lang">{file.language}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
            <div className="code-content">
              <pre key={selectedFileIndex}>
                {currentFile.code}
              </pre>
            </div>
            <div className="drag-hint">
              <span>⋮⋮ drag me</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span>{t('hero.scroll')}</span>
        <ChevronDown className="scroll-arrow" />
      </motion.div>
    </section>
  );
}
