import type { GameLocation } from '@/types/location';

const HOST = import.meta.env.BASE_URL;
let cachedLocations: GameLocation[] | null = null;

export const STORY_ORDER: string[] = [
  // Kanto Mainland - Early Game
  'pallet-town',
  'route-1',
  'viridian-city',
  'route-22',
  'route-2',
  'viridian-forest',
  'route-3',
  'route-4',
  'mt-moon',
  'cerulean-city',
  'route-24',
  'route-25',
  // Mid Game - Vermilion & Rock Tunnel
  'route-5',
  'underground-path',
  'route-6',
  'vermilion-city',
  'ss-anne',
  'route-11',
  'digletts-cave',
  'route-9',
  'route-10',
  'rock-tunnel',
  // Celadon & Lavender
  'route-8',
  'route-7',
  'celadon-city',
  'pokemon-tower',
  // Cycling Road & Coastal Routes to Fuchsia
  'route-16',
  'route-17',
  'route-18',
  'route-12',
  'route-13',
  'route-14',
  'route-15',
  'fuchsia-city',
  'safari-zone',
  'saffron-city',
  // Late Game - Sea Routes, Cinnabar & Power Plant
  'power-plant',
  'route-19',
  'route-20',
  'seafoam-islands',
  'cinnabar-island',
  'pokemon-mansion',
  'route-21',
  // League & Victory Road
  'route-23',
  'victory-road',
  'cerulean-cave',
  // Sevii Islands 1-3
  'one-island-town',
  'treasure-beach',
  'kindle-road',
  'mt-ember',
  'cape-brink',
  'three-isle-port',
  'bond-bridge',
  'berry-forest',
  // Sevii Islands 4-7
  'four-island-town',
  'icefall-cave',
  'five-island-town',
  'five-isle-meadow',
  'memorial-pillar',
  'water-labyrinth',
  'resort-gorgeous',
  'lost-cave',
  'water-path',
  'ruin-valley',
  'green-path',
  'pattern-bush',
  'outcast-island',
  'altering-cave',
  'trainer-tower',
  'canyon-entrance',
  'sevault-canyon',
  'tanoby-ruins',
  // Special / Roaming / Event
  'roaming-kanto',
  'pokecenter',
  'navel-rock',
  'birth-island',
];

const storyOrderMap = new Map<string, number>(
  STORY_ORDER.map((id, idx) => [id, idx]),
);

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
  data.sort((a, b) => {
    const orderA = storyOrderMap.get(a.id) ?? 999;
    const orderB = storyOrderMap.get(b.id) ?? 999;
    return orderA - orderB;
  });

  cachedLocations = data;
  return data;
};
