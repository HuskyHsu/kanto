import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type DisplayLanguage = 'ja' | 'en';

interface LanguageContextType {
  displayLanguage: DisplayLanguage;
  setDisplayLanguage: (lang: DisplayLanguage) => void;
  toggleLanguage: () => void;
  showSubtitle: boolean;
  setShowSubtitle: (show: boolean) => void;
  toggleSubtitle: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [displayLanguage, setDisplayLanguage] = useState<DisplayLanguage>(() => {
    const saved = localStorage.getItem('displayLanguage');
    return (saved as DisplayLanguage) || 'ja';
  });

  const [showSubtitle, setShowSubtitle] = useState<boolean>(() => {
    const saved = localStorage.getItem('showSubtitle');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('displayLanguage', displayLanguage);
  }, [displayLanguage]);

  useEffect(() => {
    localStorage.setItem('showSubtitle', String(showSubtitle));
  }, [showSubtitle]);

  const toggleLanguage = () => {
    setDisplayLanguage((prev) => (prev === 'ja' ? 'en' : 'ja'));
  };

  const toggleSubtitle = () => {
    setShowSubtitle((prev) => !prev);
  };

  return (
    <LanguageContext.Provider
      value={{
        displayLanguage,
        setDisplayLanguage,
        toggleLanguage,
        showSubtitle,
        setShowSubtitle,
        toggleSubtitle,
      }}
    >
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
