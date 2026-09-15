import React from 'react';
import { useCompanion, MAX_TEAM_SIZE } from '@/contexts/CompanionContext';
import { usePokemonContext } from '@/contexts/PokemonContext';
import { PokemonIconLink } from '@/components/pokemon';
import { cn } from '@/lib/utils';

const PokeballIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox='0 0 24 24'
    className={cn('w-5 h-5', className)}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    {/* Red Top Half */}
    <path
      d='M2.05 12a10 10 0 0 1 19.9 0h-7.05a3 3 0 0 0-5.8 0H2.05z'
      fill='#ef4444'
    />
    {/* White Bottom Half */}
    <path
      d='M2.05 12a10 10 0 0 0 19.9 0h-7.05a3 3 0 0 1-5.8 0H2.05z'
      fill='#f8fafc'
    />
    {/* Outer Ring */}
    <circle cx='12' cy='12' r='10' stroke='#334155' strokeWidth='1.8' />
    {/* Center Divider Line */}
    <line x1='2' y1='12' x2='22' y2='12' stroke='#334155' strokeWidth='1.8' />
    {/* Center Button Outer */}
    <circle cx='12' cy='12' r='3.2' fill='white' stroke='#334155' strokeWidth='1.8' />
    {/* Center Button Inner */}
    <circle cx='12' cy='12' r='1.2' fill='#334155' />
  </svg>
);

interface CompanionTriggerProps {
  className?: string;
}

export const CompanionTrigger: React.FC<CompanionTriggerProps> = ({ className = '' }) => {
  const { team, setIsOpen } = useCompanion();
  const { pokemonList } = usePokemonContext();

  const firstPid = team[0];
  const leadPokemon = firstPid
    ? pokemonList.find((p) => p.pid === firstPid) || {
        pid: firstPid,
        name: { zh: '', en: '', ja: '' },
      }
    : null;

  return (
    <button
      onClick={() => setIsOpen(true)}
      type='button'
      className={cn(
        'w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_0_rgba(203,213,225,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer group flex-shrink-0 relative',
        className,
      )}
      title={
        team.length > 0
          ? `冒險助手 (${team.length}/${MAX_TEAM_SIZE})`
          : '開啟冒險助手 (隊伍 / 雷達)'
      }
      aria-label='開啟冒險助手'
    >
      {leadPokemon ? (
        <div className='w-full h-full flex items-center justify-center overflow-hidden scale-75'>
          <PokemonIconLink
            pokemon={leadPokemon}
            className='p-0 w-full h-full'
            disableLink
            hideTypeBg
          />
        </div>
      ) : (
        <PokeballIcon className='group-hover:rotate-12 transition-transform duration-200' />
      )}
    </button>
  );
};
