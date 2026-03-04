import type { Pokemon } from '@/types/pokemon';

interface PokemonAbilitiesProps {
  abilities: Pokemon['abilities'];
}

export default function PokemonAbilities({ abilities }: PokemonAbilitiesProps) {
  return (
    <div className='text-nowrap text-center font-bold text-xs flex gap-2 justify-center flex-wrap'>
      {abilities.map((ability) => {
        return (
          <span key={ability.en} className='leading-3.5 bg-white/70 rounded px-2 py-1'>
            {ability.zh}
            <br />
            {ability.en}
            <br />
            {ability.ja}
          </span>
        );
      })}
    </div>
  );
}
