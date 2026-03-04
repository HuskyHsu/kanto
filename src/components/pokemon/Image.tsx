import { cn } from '@/lib/utils';
import type { Pokemon } from '@/types/pokemon';

interface PokemonImageProps {
  pokemon: Pokemon;
  pokedexId: number;
  isShiny?: boolean;
}

function PokemonImage({ pokemon, isShiny = false }: PokemonImageProps) {
  const imagePath = isShiny
    ? `${import.meta.env.BASE_URL}images/pmIcon/${pokemon.pid}s.png`
    : `${import.meta.env.BASE_URL}images/pmIcon/${pokemon.pid}.png`;

  return (
    <div
      className={cn('w-24 h-24 bg-cover')}
      style={{
        backgroundImage: `url(${imagePath})`,
      }}
    ></div>
  );
}

export default PokemonImage;
