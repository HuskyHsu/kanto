import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { LanguageName } from '@/types/pokemon';

interface PokemonNameProps {
  name: LanguageName;
}

function PokemonName({ name }: PokemonNameProps) {
  const { displayLanguage } = useLanguage();

  return (
    <div className='text-center text-nowrap'>
      <div className={cn('text-xl')}>{name.zh}</div>
      {displayLanguage === 'en' && <div className={cn('text-sm')}>{name.en}</div>}
      {displayLanguage === 'ja' && <div className={cn('text-sm')}>{name.ja}</div>}
    </div>
  );
}

export default PokemonName;
