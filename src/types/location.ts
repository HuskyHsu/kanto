import type { LanguageName } from './pokemon';

export type EncounterMethod =
  | 'walk'
  | 'surf'
  | 'old-rod'
  | 'good-rod'
  | 'super-rod'
  | 'rock-smash'
  | 'gift'
  | 'only-one'
  | 'pokeflute'
  | 'trade'
  | string;

export type GameVersion = 'firered' | 'leafgreen' | 'both';

export interface EncounterBase {
  method: EncounterMethod;
  methodName: { zh: string; en: string };
  chance: number;
  minLevel: number;
  maxLevel: number;
  version: GameVersion;
  tradeFor?: {
    pid: number;
    name: LanguageName;
  };
}

export interface PokemonLocationEncounter extends EncounterBase {
  locationId: string;
  locationName: LanguageName;
  areaName?: { zh: string; en: string };
  region: 'kanto' | 'sevii' | string;
  subRegion: string;
  category: 'route' | 'dungeon' | 'city' | 'special';
}

export interface LocationPokemonEncounter extends EncounterBase {
  pid: number;
  name: LanguageName;
  types: string[];
}

export interface LocationArea {
  name: { zh: string; en: string };
  encounters: LocationPokemonEncounter[];
}

export interface GameLocation {
  id: string;
  name: LanguageName;
  region: 'kanto' | 'sevii';
  subRegion: string;
  category: 'route' | 'dungeon' | 'city' | 'special';
  areas: LocationArea[];
}
