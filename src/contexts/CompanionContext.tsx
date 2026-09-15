import React, { createContext, useContext, useEffect, useState } from 'react';

interface InTeamStatus {
  inParty: boolean;
  inBox: boolean;
}

interface CompanionContextType {
  party: number[];
  box: number[];
  selectedLocationId: string | null;
  isOpen: boolean;
  activeTab: 'team' | 'radar';
  setIsOpen: (open: boolean) => void;
  setActiveTab: (tab: 'team' | 'radar') => void;
  addToParty: (pid: number) => { success: boolean; message?: string };
  addToBox: (pid: number) => { success: boolean; message?: string };
  removeFromTeam: (pid: number, slot?: 'party' | 'box') => void;
  moveToBox: (pid: number) => boolean;
  moveToParty: (pid: number) => boolean;
  setSelectedLocationId: (id: string | null) => void;
  isInTeam: (pid: number) => InTeamStatus;
  currentViewingPid: number | null;
  setCurrentViewingPid: (pid: number | null) => void;
}

const STORAGE_KEYS = {
  PARTY: 'kanto_companion_party',
  BOX: 'kanto_companion_box',
  LOCATION: 'kanto_companion_location',
};

const MAX_PARTY_SIZE = 6;
const MAX_BOX_SIZE = 6;

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

const safeGetStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
};

export const CompanionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [party, setParty] = useState<number[]>(() =>
    safeGetStorage<number[]>(STORAGE_KEYS.PARTY, [])
  );
  const [box, setBox] = useState<number[]>(() =>
    safeGetStorage<number[]>(STORAGE_KEYS.BOX, [])
  );
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LOCATION) || null;
    } catch {
      return null;
    }
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'team' | 'radar'>('team');
  const [currentViewingPid, setCurrentViewingPid] = useState<number | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PARTY, JSON.stringify(party));
    } catch {
      // Ignore storage errors
    }
  }, [party]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOX, JSON.stringify(box));
    } catch {
      // Ignore storage errors
    }
  }, [box]);

  useEffect(() => {
    try {
      if (selectedLocationId) {
        localStorage.setItem(STORAGE_KEYS.LOCATION, selectedLocationId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.LOCATION);
      }
    } catch {
      // Ignore storage errors
    }
  }, [selectedLocationId]);

  const isInTeam = (pid: number): InTeamStatus => {
    return {
      inParty: party.includes(pid),
      inBox: box.includes(pid),
    };
  };

  const addToParty = (pid: number): { success: boolean; message?: string } => {
    if (party.includes(pid)) {
      return { success: false, message: '已在主力名單中' };
    }
    if (party.length >= MAX_PARTY_SIZE) {
      // If box has space, prompt user or auto suggest box?
      return { success: false, message: `主力名單已滿 (${MAX_PARTY_SIZE} 隻)` };
    }
    // If was in box, remove from box
    if (box.includes(pid)) {
      setBox((prev) => prev.filter((id) => id !== pid));
    }
    setParty((prev) => [...prev, pid]);
    return { success: true };
  };

  const addToBox = (pid: number): { success: boolean; message?: string } => {
    if (box.includes(pid)) {
      return { success: false, message: '已在備用名單中' };
    }
    if (box.length >= MAX_BOX_SIZE) {
      return { success: false, message: `備用名單已滿 (${MAX_BOX_SIZE} 隻)` };
    }
    // If was in party, remove from party
    if (party.includes(pid)) {
      setParty((prev) => prev.filter((id) => id !== pid));
    }
    setBox((prev) => [...prev, pid]);
    return { success: true };
  };

  const removeFromTeam = (pid: number, slot?: 'party' | 'box') => {
    if (slot === 'party' || !slot) {
      setParty((prev) => prev.filter((id) => id !== pid));
    }
    if (slot === 'box' || !slot) {
      setBox((prev) => prev.filter((id) => id !== pid));
    }
  };

  const moveToBox = (pid: number): boolean => {
    if (!party.includes(pid)) return false;
    if (box.length >= MAX_BOX_SIZE) return false;
    setParty((prev) => prev.filter((id) => id !== pid));
    setBox((prev) => [...prev, pid]);
    return true;
  };

  const moveToParty = (pid: number): boolean => {
    if (!box.includes(pid)) return false;
    if (party.length >= MAX_PARTY_SIZE) return false;
    setBox((prev) => prev.filter((id) => id !== pid));
    setParty((prev) => [...prev, pid]);
    return true;
  };

  return (
    <CompanionContext.Provider
      value={{
        party,
        box,
        selectedLocationId,
        isOpen,
        activeTab,
        setIsOpen,
        setActiveTab,
        addToParty,
        addToBox,
        removeFromTeam,
        moveToBox,
        moveToParty,
        setSelectedLocationId,
        isInTeam,
        currentViewingPid,
        setCurrentViewingPid,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCompanion = () => {
  const context = useContext(CompanionContext);
  if (!context) {
    throw new Error('useCompanion must be used within a CompanionProvider');
  }
  return context;
};
