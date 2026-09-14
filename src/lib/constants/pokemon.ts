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

export interface PokemonTypeInfo {
  zh: string;
  ja: string;
  en: string;
  bg: string;
  text: string;
  border: string;
}

export const POKEMON_TYPE_INFO: Record<string, PokemonTypeInfo> = {
  Normal: { zh: '一般', ja: 'ノーマル', en: 'Normal', bg: 'bg-[#9fa19f]', text: 'text-white', border: 'border-[#8a8a89]' },
  Fire: { zh: '火', ja: 'ほのお', en: 'Fire', bg: 'bg-[#e62829]', text: 'text-white', border: 'border-[#c12223]' },
  Water: { zh: '水', ja: 'みず', en: 'Water', bg: 'bg-[#2980ef]', text: 'text-white', border: 'border-[#1f68c5]' },
  Electric: { zh: '電', ja: 'でんき', en: 'Electric', bg: 'bg-[#fac000]', text: 'text-slate-900', border: 'border-[#d4a300]' },
  Grass: { zh: '草', ja: 'くさ', en: 'Grass', bg: 'bg-[#3fa129]', text: 'text-white', border: 'border-[#328321]' },
  Ice: { zh: '冰', ja: 'こおり', en: 'Ice', bg: 'bg-[#3dcef3]', text: 'text-slate-900', border: 'border-[#2eb0d1]' },
  Fighting: { zh: '格鬥', ja: 'かくとう', en: 'Fighting', bg: 'bg-[#ff8000]', text: 'text-white', border: 'border-[#d96d00]' },
  Poison: { zh: '毒', ja: 'どく', en: 'Poison', bg: 'bg-[#9141cb]', text: 'text-white', border: 'border-[#7934ab]' },
  Ground: { zh: '地面', ja: 'じめん', en: 'Ground', bg: 'bg-[#915121]', text: 'text-white', border: 'border-[#733f19]' },
  Flying: { zh: '飛行', ja: 'ひこう', en: 'Flying', bg: 'bg-[#81b9ef]', text: 'text-slate-900', border: 'border-[#659cd1]' },
  Psychic: { zh: '超能力', ja: 'エスパー', en: 'Psychic', bg: 'bg-[#ef4179]', text: 'text-white', border: 'border-[#cb3364]' },
  Bug: { zh: '蟲', ja: 'むし', en: 'Bug', bg: 'bg-[#91a119]', text: 'text-white', border: 'border-[#748212]' },
  Rock: { zh: '岩石', ja: 'いわ', en: 'Rock', bg: 'bg-[#afa981]', text: 'text-white', border: 'border-[#8f8a67]' },
  Ghost: { zh: '幽靈', ja: 'ゴースト', en: 'Ghost', bg: 'bg-[#704170]', text: 'text-white', border: 'border-[#583258]' },
  Dragon: { zh: '龍', ja: 'ドラゴン', en: 'Dragon', bg: 'bg-[#5060e1]', text: 'text-white', border: 'border-[#3e4cb8]' },
  Dark: { zh: '惡', ja: 'あく', en: 'Dark', bg: 'bg-[#50413f]', text: 'text-white', border: 'border-[#3c3130]' },
  Steel: { zh: '鋼', ja: 'はがね', en: 'Steel', bg: 'bg-[#60a1b8]', text: 'text-white', border: 'border-[#4c8397]' },
  Fairy: { zh: '妖精', ja: 'フェアリー', en: 'Fairy', bg: 'bg-[#ef70ef]', text: 'text-white', border: 'border-[#c85ac8]' },
};
