import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type DisplayLanguage = 'ja' | 'en';

interface LanguageContextType {
  displayLanguage: DisplayLanguage;
  setDisplayLanguage: (lang: DisplayLanguage) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [displayLanguage, setDisplayLanguage] = useState<DisplayLanguage>(() => {
    const saved = localStorage.getItem('displayLanguage');
    return (saved as DisplayLanguage) || 'ja';
  });

  useEffect(() => {
    localStorage.setItem('displayLanguage', displayLanguage);
  }, [displayLanguage]);

  const toggleLanguage = () => {
    setDisplayLanguage((prev) => (prev === 'ja' ? 'en' : 'ja'));
  };

  return (
    <LanguageContext.Provider value={{ displayLanguage, setDisplayLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
