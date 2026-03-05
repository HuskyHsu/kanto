import { useLanguage } from '@/contexts/LanguageContext';
import type { Pokemon } from '@/types/pokemon';

interface PokemonAbilitiesProps {
  abilities: Pokemon['abilities'];
}

export default function PokemonAbilities({ abilities }: PokemonAbilitiesProps) {
  const { displayLanguage } = useLanguage();

  return (
    <div className='text-nowrap text-center font-bold text-xs flex gap-2 justify-center flex-wrap'>
      {abilities.map((ability) => {
        return (
          <span key={ability.en} className='leading-3.5 bg-red-700/30 rounded px-2 py-1'>
            {ability.zh}
            <br />
            {displayLanguage === 'en' ? ability.en : ability.ja}
          </span>
        );
      })}
    </div>
  );
}
