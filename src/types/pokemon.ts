// TypeScript types based on the JSON structure from public/data/base_pm_list_101.json

export interface LanguageName {
  zh: string;
  ja: string;
  en: string;
}

export interface Pokemon {
  pid: number;
  name: LanguageName;
  types: string[];
  eggGroups: string[];
  abilities: LanguageName[];
  base: [number, number, number, number, number, number]; // HP, Attack, Defense, Sp.Attack, Sp.Defense, Speed
  ev: [number, number, number, number, number, number]; // EV yields in same order as base stats
  latest: boolean;
}

export type PokemonList = Pokemon[];

// Detailed Pokemon types for the detail page
export interface PokemonMove {
  id: number;
  type: string;
  name: LanguageName;
  category: 'Physical' | 'Special' | 'Status';
  accuracy: number | null;
  power: number;
  pp: number;
}

export interface LevelUpMove extends PokemonMove {
  level: number;
}

export interface TMMove extends PokemonMove {
  tm: string;
}

export interface EvolutionNode {
  pid: number;
  type: string[];
  name: LanguageName;
  level: number;
  method: string;
  condition?: string[];
  to?: EvolutionNode[];
}

export interface DetailedPokemon extends Pokemon {
  genderRate: number;
  levelUpMoves: LevelUpMove[];
  TMMoves: TMMove[];
  HTMMoves: TMMove[];
  eggMoves: PokemonMove[];
  tutorMoves: PokemonMove[];
  evolution?: EvolutionNode;
}

// Type weakness related types
export interface TypeWeaknessProps {
  pokemon: DetailedPokemon;
}

export interface WeaknessDisplayProps {
  types: string[];
}

export interface TypeRateProps {
  targetRate: import('@/lib/constants/typeEffectiveness').EffectivenessMultiplier;
  types: string[];
}

export type BasePoint = {
  Hp: number;
  Atk: number;
  Def: number;
  SpA: number;
  SpD: number;
  Spe: number;
  Total: number;
};

export interface MinimalPokemon {
  link: string;
  type: string[];
  name: LanguageName;
  altForm?: string;
  level?: number;
}

export interface ExpandedMoveData {
  id: number;
  name: LanguageName;
  type: string;
  category: 'Status' | 'Physical' | 'Special';
  power: number;
  cooldown: number;
  levelUpPm?: MinimalPokemon[];
  tmPm?: MinimalPokemon[];
  alphaPm?: MinimalPokemon[];
}

export type Pokedex = 'kanto' | 'johto' | 'hoenn';
