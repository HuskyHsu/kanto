import { cn } from '@/lib/utils';
import type { LanguageName } from '@/types/pokemon';

interface PokemonNameProps {
  name: LanguageName;
}

function PokemonName({ name }: PokemonNameProps) {
  return (
    <div className='text-center text-nowrap'>
      <div className={cn('text-xl')}>{name.zh}</div>
      <div className={cn('text-sm')}>{name.en}</div>
      <div className={cn('text-sm')}>{name.ja}</div>
    </div>
  );
}

export default PokemonName;
