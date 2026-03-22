export const POKEMON_TYPES = [
  'Grass',
  'Fire',
  'Water',
  'Electric',
  'Normal',
  'Fighting',
  'Flying',
  'Poison',
  'Ground',
  'Rock',
  'Bug',
  'Ghost',
  'Steel',
  'Psychic',
  'Ice',
  'Dragon',
  'Dark',
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export const EV_STATS = ['HP', 'ATK', 'DEF', 'SP.ATK', 'SP.DEF', 'SPD'] as const;
export type EVStat = (typeof EV_STATS)[number];
