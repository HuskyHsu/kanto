import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/Loading';
import { useLanguage } from '@/contexts/LanguageContext';
import { POKEMON_TYPE_INFO } from '@/lib/constants/pokemon';
import { cn } from '@/lib/utils';
import type { DetailedPokemon } from '@/types/pokemon';
import { Sparkles } from 'lucide-react';
import { TypeWeakness } from './TypeWeakness';

interface BasicInfoProps {
  pokemon: DetailedPokemon;
  loading: boolean;
}

const genderRatioMap = {
  0: [100, 0],
  1: [87.5, 12.5],
  2: [75, 25],
  4: [50, 50],
  6: [25, 75],
  7: [12.5, 87.5],
  8: [0, 100],
  '-1': [0, 0],
};

export default function BasicInfo({ pokemon, loading = false }: BasicInfoProps) {
  const { displayLanguage } = useLanguage();
  const isGenderless = pokemon.genderRate === -1;
  const [maleRate, femaleRate] =
    genderRatioMap[pokemon.genderRate as keyof typeof genderRatioMap] || [50, 50];

  return (
    <Card className='border-[3px] border-[#34925e] rounded-[10px] bg-white shadow-none'>
      <CardHeader className='py-2.5 sm:py-4 px-3 sm:px-6'>
        <CardTitle className='flex items-center gap-2 font-press-start text-xs sm:text-lg uppercase tracking-wider text-slate-800 relative pl-3.5 sm:pl-4 before:content-[""] before:absolute before:left-0 before:top-[15%] before:h-[70%] before:w-1 before:bg-[#e05038]'>
          Basic Information
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-3 sm:space-y-5 px-3 sm:px-6 pb-3 sm:pb-6'>
        {/* Top Hero Section: Sprites on Left + Identity & Data Tiles on Right */}
        <div className='flex flex-col lg:flex-row items-center lg:items-stretch gap-3 sm:gap-5 pb-3 sm:pb-5 border-b border-slate-200/80'>
          {/* Dual Sprites Showcase (Left) */}
          <div className='flex items-center justify-center gap-2.5 sm:gap-4 shrink-0'>
            {/* Normal Sprite */}
            <div className='flex flex-col items-center justify-between bg-slate-50 border-2 border-slate-200 rounded-xl p-2.5 sm:p-3 shadow-2xs group w-36 sm:w-40 h-auto sm:h-full'>
              <div className='flex-1 flex items-center justify-center py-1 sm:py-2'>
                {loading ? (
                  <Loading size='h-32 w-32 sm:h-36 sm:w-36' />
                ) : (
                  <img
                    src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.pid}.png`}
                    alt={pokemon.name.zh}
                    className='[image-rendering:pixelated] w-32 h-32 sm:w-36 sm:h-36 object-contain filter drop-shadow-[0_4px_0_rgba(0,0,0,0.08)] group-hover:scale-105 transition-transform'
                  />
                )}
              </div>
              <span className='text-[10px] font-press-start text-slate-500 uppercase mt-1.5 sm:mt-2'>
                Normal
              </span>
            </div>

            {/* Shiny Sprite */}
            <div className='flex flex-col items-center justify-between bg-amber-50/40 border-2 border-amber-200/90 rounded-xl p-2.5 sm:p-3 shadow-2xs group relative w-36 sm:w-40 h-auto sm:h-full'>
              {/* Shiny Star Badge */}
              <div
                className='absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-xs border border-amber-200 select-none group-hover:scale-110 group-hover:rotate-12 transition-transform'
                title='Shiny'
              >
                <Sparkles className='w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white' />
              </div>

              <div className='flex-1 flex items-center justify-center py-1 sm:py-2'>
                {loading ? (
                  <Loading size='h-32 w-32 sm:h-36 sm:w-36' />
                ) : (
                  <img
                    src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.pid}s.png`}
                    alt={`${pokemon.name.zh} (Shiny)`}
                    className='[image-rendering:pixelated] w-32 h-32 sm:w-36 sm:h-36 object-contain filter drop-shadow-[0_4px_0_rgba(0,0,0,0.08)] group-hover:scale-105 transition-transform'
                  />
                )}
              </div>
              <span className='inline-flex items-center gap-1 text-[10px] font-press-start text-amber-600 uppercase mt-1.5 sm:mt-2'>
                <Sparkles className='w-2.5 h-2.5 fill-amber-500 text-amber-500' />
                Shiny
              </span>
            </div>
          </div>

          {/* Identity & Data Tiles (Right) */}
          <div className='flex-1 min-w-0 flex flex-col justify-between w-full'>
            {/* Header: Number, Names, and Types in one sleek top bar */}
            <div className='flex flex-col lg:flex-row items-center justify-between gap-2 sm:gap-3 pb-2.5 sm:pb-3 border-b border-slate-100'>
              <div className='flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5 text-center lg:text-left text-base sm:text-xl'>
                <span className='font-mono font-bold text-slate-400'>
                  #{pokemon.pid.toString().padStart(4, '0')}
                </span>
                <a
                  href={`https://wiki.52poke.com/zh-hant/${pokemon.name.zh}`}
                  target='_blank'
                  rel='noreferrer'
                  className='font-bold text-blue-600 underline underline-offset-2 tracking-tight hover:text-blue-800 transition-colors'
                  title='前往神奇寶貝百科'
                >
                  {pokemon.name.zh}
                </a>
                <a
                  href={`https://www.serebii.net/pokedex-rs/${pokemon.pid.toString().padStart(3, '0')}.shtml`}
                  target='_blank'
                  rel='noreferrer'
                  className='font-mono font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors'
                  title='前往 Serebii.net'
                >
                  {pokemon.name.en}
                </a>
                <span className={cn('text-slate-400', displayLanguage === 'ja' ? 'font-pixel-jp' : 'font-sans')}>
                  {pokemon.name.ja}
                </span>
              </div>

              {/* Types */}
              <div className='flex items-center justify-center lg:justify-end gap-1.5 flex-wrap'>
                {pokemon.types.map((type) => {
                  const key = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
                  const info = POKEMON_TYPE_INFO[key];
                  const subLabel = displayLanguage === 'ja' ? info?.ja : info?.en;

                  return (
                    <span
                      key={type}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold shadow-2xs border select-none transition-transform hover:scale-105',
                        info?.bg || 'bg-slate-600',
                        info?.text || 'text-white',
                        info?.border || 'border-slate-700',
                      )}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}images/type/${type}.png`}
                        alt={type}
                        className='w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain filter drop-shadow-xs [image-rendering:pixelated]'
                      />
                      <span>{info?.zh || type}</span>
                      {subLabel && (
                        <span
                          className={cn(
                            'text-[10px] opacity-90 font-medium',
                            displayLanguage === 'ja' ? 'font-pixel-jp' : 'font-sans',
                          )}
                        >
                          {subLabel}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 3 Data Tiles: 2 columns on mobile, 3 columns on desktop */}
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-2 sm:pt-3'>
              {/* Tile 1: Abilities (full row on mobile) */}
              <div className='col-span-2 sm:col-span-1 bg-slate-50/80 border border-slate-200 rounded-xl p-2 sm:p-3 flex flex-col justify-between gap-1 sm:gap-1.5'>
                <span className='text-[10px] font-press-start uppercase text-slate-500 text-center sm:text-left'>
                  Abilities
                </span>
                <div className='flex flex-wrap gap-1.5 justify-center sm:justify-start'>
                  {pokemon.abilities.map((ability) => {
                    const subName = displayLanguage === 'en' ? ability.en : ability.ja;
                    return (
                      <a
                        key={ability.en}
                        href={`https://wiki.52poke.com/zh-hant/${ability.zh}（特性）`}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-baseline gap-1 text-xs text-blue-700 bg-white hover:bg-blue-50 px-2 py-0.5 sm:py-1 rounded border border-slate-200 font-medium transition-colors group'
                      >
                        <span className='underline'>{ability.zh}</span>
                        <span
                          className={cn(
                            'text-[10px] text-slate-400 no-underline',
                            displayLanguage === 'ja' && 'font-pixel-jp',
                          )}
                        >
                          ({subName})
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Tile 2: Gender Ratio (half row on mobile) */}
              <div className='col-span-1 bg-slate-50/80 border border-slate-200 rounded-xl p-2 sm:p-3 flex flex-col justify-between gap-1 sm:gap-1.5'>
                <span className='text-[10px] font-press-start uppercase text-slate-500 text-center sm:text-left'>
                  Gender Ratio
                </span>
                {isGenderless ? (
                  <div className='text-xs font-medium text-slate-600 bg-white px-2 py-0.5 sm:py-1 rounded border border-slate-200 inline-block text-center sm:text-left'>
                    無性別
                  </div>
                ) : (
                  <div className='space-y-1'>
                    <div className='flex items-center justify-between text-xs font-mono font-medium'>
                      <span className='text-blue-600 font-bold'>♂ {maleRate}%</span>
                      <span className='text-pink-600 font-bold'>♀ {femaleRate}%</span>
                    </div>
                    <div className='w-full h-1.5 rounded-full overflow-hidden flex bg-slate-200'>
                      <div className='bg-blue-500 h-full' style={{ width: `${maleRate}%` }} />
                      <div className='bg-pink-500 h-full' style={{ width: `${femaleRate}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Tile 3: Egg Groups (half row on mobile) */}
              <div className='col-span-1 bg-slate-50/80 border border-slate-200 rounded-xl p-2 sm:p-3 flex flex-col justify-between gap-1 sm:gap-1.5'>
                <span className='text-[10px] font-press-start uppercase text-slate-500 text-center sm:text-left'>
                  Egg Groups
                </span>
                <div className='flex flex-wrap gap-1.5 justify-center sm:justify-start'>
                  {pokemon.eggGroups.map((eggGroup) => (
                    <a
                      key={eggGroup}
                      href={`https://wiki.52poke.com/zh-hant/${eggGroup}（蛋群）`}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center text-xs text-blue-700 bg-white hover:bg-blue-50 px-2 py-0.5 sm:py-1 rounded border border-slate-200 font-medium transition-colors underline'
                    >
                      {eggGroup}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Full-width Type Weakness */}
        <div className='bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 sm:p-4'>
          <TypeWeakness pokemon={pokemon} />
        </div>
      </CardContent>
    </Card>
  );
}
