import React, { createContext, useContext, useEffect, useState } from 'react';

interface CompanionContextType {
  team: number[];
  selectedLocationId: string | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToTeam: (pid: number) => { success: boolean; message?: string };
  removeFromTeam: (pid: number) => void;
  reorderTeam: (startIndex: number, endIndex: number) => void;
  moveToTop: (pid: number) => void;
  setSelectedLocationId: (id: string | null) => void;
  isInTeam: (pid: number) => boolean;
  currentViewingPid: number | null;
  setCurrentViewingPid: (pid: number | null) => void;
}

const STORAGE_KEYS = {
  TEAM: 'kanto_companion_team',
  PARTY: 'kanto_companion_party',
  BOX: 'kanto_companion_box',
  LOCATION: 'kanto_companion_location',
};

export const MAX_TEAM_SIZE = 12;

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
  const [team, setTeam] = useState<number[]>(() => {
    const savedTeam = safeGetStorage<number[] | null>(STORAGE_KEYS.TEAM, null);
    if (savedTeam && Array.isArray(savedTeam)) {
      return savedTeam.slice(0, MAX_TEAM_SIZE);
    }
    // Migrate from legacy party + box
    const oldParty = safeGetStorage<number[]>(STORAGE_KEYS.PARTY, []);
    const oldBox = safeGetStorage<number[]>(STORAGE_KEYS.BOX, []);
    const combined = Array.from(new Set([...oldParty, ...oldBox])).slice(0, MAX_TEAM_SIZE);
    return combined;
  });

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LOCATION) || null;
    } catch {
      return null;
    }
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentViewingPid, setCurrentViewingPid] = useState<number | null>(null);

  // Sync team with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
    } catch {
      // Ignore storage errors
    }
  }, [team]);

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

  const isInTeam = (pid: number): boolean => {
    return team.includes(pid);
  };

  const addToTeam = (pid: number): { success: boolean; message?: string } => {
    if (team.includes(pid)) {
      return { success: false, message: '已在隊伍名單中' };
    }
    if (team.length >= MAX_TEAM_SIZE) {
      return { success: false, message: `隊伍名單已滿 (${MAX_TEAM_SIZE} 隻)` };
    }
    setTeam((prev) => [...prev, pid]);
    return { success: true };
  };

  const removeFromTeam = (pid: number) => {
    setTeam((prev) => prev.filter((id) => id !== pid));
  };

  const reorderTeam = (startIndex: number, endIndex: number) => {
    setTeam((prev) => {
      if (
        startIndex < 0 ||
        startIndex >= prev.length ||
        endIndex < 0 ||
        endIndex >= prev.length ||
        startIndex === endIndex
      ) {
        return prev;
      }
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const moveToTop = (pid: number) => {
    setTeam((prev) => {
      const index = prev.indexOf(pid);
      if (index <= 0) return prev;
      const result = [...prev];
      const [removed] = result.splice(index, 1);
      result.unshift(removed);
      return result;
    });
  };

  return (
    <CompanionContext.Provider
      value={{
        team,
        selectedLocationId,
        isOpen,
        setIsOpen,
        addToTeam,
        removeFromTeam,
        reorderTeam,
        moveToTop,
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
