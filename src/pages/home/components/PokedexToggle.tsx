import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { Pokedex } from '@/types/pokemon';

interface PokedexToggleProps {
  selectedPokedex: Pokedex;
  onPokedexChange: (Pokedex: Pokedex) => void;
}

function PokedexToggle({ selectedPokedex, onPokedexChange }: PokedexToggleProps) {
  const handleToggle = (targetPokedex: Pokedex) => {
    // Track Pokedex toggle
    trackCustomEvent('Pokedex_toggle', {
      new_state: targetPokedex,
      previous_state: selectedPokedex,
    });

    onPokedexChange(targetPokedex);
  };

  return (
    <div className='mb-4 flex gap-3 items-center font-press-start'>
      <div className='flex flex-col justify-center h-10'>
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={() => handleToggle('kanto')}
            className={cn(
              'relative px-3 py-2 text-[10px] uppercase font-semibold leading-none rounded-[10px] transition-all duration-100 ease-linear cursor-pointer',
              'border-2 border-[#34925e] focus:outline-none focus:ring-2 focus:ring-[#34925e] focus:ring-offset-2',
              'shadow-[2px_2px_0_0_rgba(52,146,94,0.3)] hover:-translate-y-0.5 hover:shadow-[2px_4px_0_0_rgba(52,146,94,0.3)]',
              selectedPokedex === 'kanto'
                ? 'bg-linear-to-r from-red-600 to-green-600 text-white'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50',
            )}
          >
            Kanto
          </button>
          <button
            type='button'
            onClick={() => handleToggle('johto')}
            className={cn(
              'relative px-3 py-2 text-[10px] uppercase font-semibold leading-none rounded-[10px] transition-all duration-100 ease-linear cursor-pointer',
              'border-2 border-[#34925e] focus:outline-none focus:ring-2 focus:ring-[#34925e] focus:ring-offset-2',
              'shadow-[2px_2px_0_0_rgba(52,146,94,0.3)] hover:-translate-y-0.5 hover:shadow-[2px_4px_0_0_rgba(52,146,94,0.3)]',
              selectedPokedex === 'johto'
                ? 'bg-linear-to-r from-[#FFDF00] via-[#C0C0C0] to-violet-600 text-white'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50',
            )}
          >
            Johto
          </button>
          <button
            type='button'
            onClick={() => handleToggle('hoenn')}
            className={cn(
              'relative px-3 py-2 text-[10px] uppercase font-semibold leading-none rounded-[10px] transition-all duration-100 ease-linear cursor-pointer',
              'border-2 border-[#34925e] focus:outline-none focus:ring-2 focus:ring-[#34925e] focus:ring-offset-2',
              'shadow-[2px_2px_0_0_rgba(52,146,94,0.3)] hover:-translate-y-0.5 hover:shadow-[2px_4px_0_0_rgba(52,146,94,0.3)]',
              selectedPokedex === 'hoenn'
                ? 'bg-linear-to-r from-red-600 via-blue-600 to-green-600 text-white'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50',
            )}
          >
            Hoenn
          </button>
        </div>
      </div>
    </div>
  );
}

export default PokedexToggle;
export type { Pokedex };
