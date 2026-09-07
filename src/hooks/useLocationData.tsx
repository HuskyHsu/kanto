import { LocationContext } from '@/contexts/LocationContext';
import { useContext } from 'react';

export function useLocationData() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationData must be used within a LocationProvider');
  }
  return context;
}
