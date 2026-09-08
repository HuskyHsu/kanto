import type { GameLocation } from '@/types/location';

const HOST = import.meta.env.BASE_URL;
let cachedLocations: GameLocation[] | null = null;

export const fetchLocationsData = async (): Promise<GameLocation[]> => {
  if (cachedLocations) {
    return cachedLocations;
  }

  const base = HOST.endsWith('/') ? HOST.slice(0, -1) : HOST;
  const response = await fetch(`${base}/data/locations.json`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: GameLocation[] = await response.json();
  cachedLocations = data;
  return data;
};
