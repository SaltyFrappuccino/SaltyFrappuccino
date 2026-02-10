import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  
  const loadingTexts = [
    "INITIALIZING_CORE_SYSTEMS...",
    "LOADING_ASSETS...",
    "CONNECTING_TO_NEURAL_NET...",
    "ESTABLISHING_UPLINK...",
    "SYSTEM_READY"
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 100);

    const textInterval = setInterval(() => {
      setTextIndex(prev => {
        if (prev >= loadingTexts.length - 1) {
          clearInterval(textInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    if (progress >= 100) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [progress, onComplete]);

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="preloader-content">
        <div className="terminal-text">
          <span className="prefix">{">"}</span>
          <span className="cursor-text ms-2">{loadingTexts[textIndex]}</span>
          <span className="blinking-cursor">_</span>
        </div>
        
        <div className="progress-container">
          <motion.div 
            className="progress-bar"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        <div className="progress-percentage">
          {Math.floor(Math.min(progress, 100))}%
        </div>
      </div>
      
      <div className="scanline"></div>
    </motion.div>
  );
}
