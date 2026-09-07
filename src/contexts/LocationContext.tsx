import React, { createContext, useEffect, useState } from 'react';
import { fetchLocationsData } from '@/services/locationService';
import type { GameLocation } from '@/types/location';

interface LocationContextType {
  locationList: GameLocation[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: React.ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [locationList, setLocationList] = useState<GameLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocationData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLocationsData();
      setLocationList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocationData();
  }, []);

  const refetch = async () => {
    await loadLocationData();
  };

  const value: LocationContextType = {
    locationList,
    loading,
    error,
    refetch,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}
