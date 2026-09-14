import { PokemonTypes } from '@/components/pokemon';
import { useLanguage } from '@/contexts/LanguageContext';
import { WEAKNESS_MULTIPLIERS } from '@/lib/constants/typeEffectiveness';
import { cn } from '@/lib/utils';
import { calculateTypeWeaknesses, filterTypesByEffectiveness } from '@/lib/utils/typeWeakness';
import type { TypeRateProps, TypeWeaknessProps, WeaknessDisplayProps } from '@/types/pokemon';

const EFFECTIVENESS_TERMS = {
  super: {
    zh: '效果絕佳',
    ja: 'こうかばつぐん',
    en: 'Super Effective',
  },
  notVery: {
    zh: '效果不好',
    ja: 'いまひとつ',
    en: 'Not Very Effective',
  },
  none: {
    zh: '沒有效果',
    ja: 'こうかなし',
    en: 'No Effect',
  },
};

function TypeRate({ targetRate, types }: TypeRateProps) {
  const { displayLanguage, showSubtitle } = useLanguage();
  const typeWeaknesses = calculateTypeWeaknesses(types);
  const matchingTypes = filterTypesByEffectiveness(typeWeaknesses, targetRate);

  if (matchingTypes.length === 0) {
    return null;
  }

  const badgeColor =
    targetRate >= 2
      ? 'bg-red-500 text-white'
      : targetRate === 0
        ? 'bg-slate-700 text-white'
        : 'bg-emerald-600 text-white';

  const term =
    targetRate >= 2
      ? EFFECTIVENESS_TERMS.super
      : targetRate === 0
        ? EFFECTIVENESS_TERMS.none
        : EFFECTIVENESS_TERMS.notVery;

  const isJa = displayLanguage === 'ja';
  const primaryText = isJa ? term.ja : term.en;
  const secondaryText = term.zh;

  return (
    <div className='flex flex-col gap-1.5 p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs min-w-[140px] flex-1 sm:flex-initial'>
      <div className='flex items-center gap-1.5 flex-wrap'>
        <span className={`px-2 py-0.5 rounded text-[10px] font-press-start font-bold ${badgeColor}`}>
          {targetRate}x
        </span>
        <span
          className={cn(
            'text-[11px] text-slate-700 font-semibold',
            isJa && 'font-pixel-jp text-[10px] tracking-wide',
          )}
        >
          {primaryText}
        </span>
        {showSubtitle && (
          <span className='text-[10px] text-slate-400 font-sans'>
            ({secondaryText})
          </span>
        )}
      </div>
      <div className='flex flex-wrap gap-1.5 pt-0.5'>
        {matchingTypes.map(({ type }) => (
          <PokemonTypes types={[type]} key={type} />
        ))}
      </div>
    </div>
  );
}

function Weakness({ types }: WeaknessDisplayProps) {
  return (
    <div className='flex flex-wrap gap-3 items-start justify-center sm:justify-start'>
      {WEAKNESS_MULTIPLIERS.map((rate) => (
        <TypeRate targetRate={rate} types={types} key={rate} />
      ))}
    </div>
  );
}

export function TypeWeakness({ pokemon }: TypeWeaknessProps) {
  const { displayLanguage } = useLanguage();
  const isJa = displayLanguage === 'ja';

  return (
    <div className='space-y-2.5'>
      <div className='flex items-center justify-center sm:justify-start gap-2'>
        <span className='text-[11px] font-press-start uppercase text-slate-500'>
          Type Effectiveness
        </span>
        {isJa && (
          <span className='text-xs text-slate-400 font-pixel-jp'>(タイプ相性)</span>
        )}
      </div>
      <Weakness types={pokemon.types} />
    </div>
  );
}
