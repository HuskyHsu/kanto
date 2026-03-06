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
  genderRate: number;
}

export type PokemonList = Pokemon[];

// Detailed Pokemon types for the detail page
export interface PokemonMove {
  id: number;
  name: LanguageName;
  type: string;
  category: 'Physical' | 'Special' | 'Status';
  power: number;
  cooldown: number;
}

export interface LevelUpMove extends PokemonMove {
  level: number;
  plus: number;
}

export interface TMMove extends PokemonMove {
  tm: number;
}

export interface EvolutionNode {
  link: string;
  type: string[];
  name: LanguageName;
  altForm?: string;
  level: number;
  method: string;
  condition?: LanguageName;
  to?: EvolutionNode[];
}

export interface DetailedPokemon extends Pokemon {
  genderRatio: number;
  catchRate: number;
  expGroup: string;
  height: number;
  weight: number;
  alphaMove?: PokemonMove;
  levelUpMoves: LevelUpMove[];
  tmMoves: TMMove[];
  evolutionTree?: EvolutionNode;
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
