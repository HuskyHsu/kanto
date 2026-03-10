import { PokemonCard } from '@/components/pokemon';
import type { PokemonList } from '@/types/pokemon';
import { memo } from 'react';

export interface PokemonGridProps {
  pokemonList: PokemonList;
  isShiny: boolean;
  isShowEV: boolean;
  isShowAbility: boolean;
}

export const PokemonGrid = memo(function PokemonGrid({
  pokemonList,
  isShiny,
  isShowEV,
  isShowAbility,
}: PokemonGridProps) {
  return (
    <div className='mt-6 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 justify-items-center gap-x-3 gap-y-6 text-slate-800 transition-all duration-200 ease-in-out'>
      {pokemonList
        .sort((a, b) => {
          return a.pid - b.pid;
        })
        .map((pokemon) => (
          <PokemonCard
            key={pokemon.pid}
            pokemon={pokemon}
            isShiny={isShiny}
            isShowEV={isShowEV}
            isShowAbility={isShowAbility}
          />
        ))}
    </div>
  );
});
