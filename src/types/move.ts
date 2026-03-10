import type { LanguageName } from './pokemon';

export interface Move {
  id: number;
  name: LanguageName; // { zh: string; ja: string; en: string }
  type: string;
  category: 'Physical' | 'Special' | 'Status';
  power: number;
  accuracy?: number;
  pp: number;
  tm?: string | number;
}

export type MoveList = Move[];
