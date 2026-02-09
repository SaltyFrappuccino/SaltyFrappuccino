import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ChillModeContextType {
  isChillMode: boolean;
  toggleChillMode: () => void;
}

const ChillModeContext = createContext<ChillModeContextType | undefined>(undefined);

export function ChillModeProvider({ children }: { children: ReactNode }) {
  const [isChillMode, setIsChillMode] = useState(() => {
    const saved = localStorage.getItem('chillMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('chillMode', String(isChillMode));
    
    if (isChillMode) {
      document.body.classList.add('chill-mode');
    } else {
      document.body.classList.remove('chill-mode');
    }
  }, [isChillMode]);

  const toggleChillMode = () => setIsChillMode(!isChillMode);

  return (
    <ChillModeContext.Provider value={{ isChillMode, toggleChillMode }}>
      {children}
    </ChillModeContext.Provider>
  );
}

export function useChillMode() {
  const context = useContext(ChillModeContext);
  if (!context) {
    throw new Error('useChillMode must be used within a ChillModeProvider');
  }
  return context;
}
