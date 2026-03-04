import type { LanguageName } from './pokemon';

export interface Move {
  id: number;
  name: LanguageName; // { zh: string; ja: string; en: string }
  type: string;
  category: 'Physical' | 'Special' | 'Status';
  power: number;
  cooldown: number;
  tm?: number;
}

export type MoveList = Move[];
