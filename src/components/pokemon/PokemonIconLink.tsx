import { Link } from 'react-router-dom';

import { FromClass, ToClass } from '@/lib/color';
import { cn } from '@/lib/utils';
import type { MinimalPokemon } from '@/types/pokemon';

interface PokemonIconLinkProps {
  pokemon:
    | MinimalPokemon
    | {
        pid: number;
        name: { zh: string; en?: string; ja?: string };
        type?: string[];
        types?: string[];
        level?: number;
      };
  showLevel?: boolean;
  className?: string;
  disableLink?: boolean;
  hideTypeBg?: boolean;
  fillBg?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export function PokemonIconLink({
  pokemon,
  showLevel = false,
  className,
  disableLink = false,
  hideTypeBg = false,
  fillBg = false,
  onClick,
  children,
}: PokemonIconLinkProps) {
  const types =
    pokemon.type ||
    ('types' in pokemon ? (pokemon as { types?: string[] }).types : undefined) ||
    ['normal'];
  const primaryType = types[0] || 'normal';
  const secondaryType = types[1] || primaryType;
  const bgClass = cn(
    FromClass[primaryType as keyof typeof FromClass] || 'from-slate-300',
    ToClass[secondaryType as keyof typeof ToClass] || 'to-slate-400',
  );

  const from =
    (pokemon.level || 0) > 1 ? `Lv.${pokemon.level}` : pokemon.level === 0 ? 'Evolve' : '—';

  const content = (
    <div
      className={cn(
        'relative flex items-center justify-center',
        fillBg ? 'w-full h-full' : 'w-10 h-10',
      )}
    >
      {!hideTypeBg && (
        <div
          className={cn(
            'bg-linear-to-br',
            fillBg ? 'absolute inset-0 w-full h-full' : 'absolute -top-1 -left-2 h-4 w-14 rounded',
            bgClass,
          )}
        />
      )}

      <div
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/pmIcon8Bit/${pokemon.pid}.png)`,
        }}
        title={pokemon.name.zh}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 switchingLeftRight filter drop-shadow-md z-10'
      />
      {showLevel && pokemon.level !== undefined && (
        <span className='text-black absolute -bottom-10 left-1/2 -translate-x-1/2 text-[12px] whitespace-nowrap z-10'>
          {from}
        </span>
      )}
      {children}
    </div>
  );

  const commonClass = cn(
    'group relative flex flex-col items-center justify-center p-8 w-10 h-10',
    'transition-all duration-300',
    'hover:scale-105 hover:z-20',
    className,
  );

  if (disableLink) {
    return (
      <div className={commonClass} title={pokemon.name.zh} onClick={onClick}>
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/pokemon/${pokemon.pid}`}
      className={commonClass}
      title={pokemon.name.zh}
      onClick={onClick}
    >
      {content}
    </Link>
  );
}
