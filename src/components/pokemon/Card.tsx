import { trackCustomEvent, trackEvent } from '@/lib/analytics';
import { FromClass, ToClass } from '@/lib/color';
import { cn } from '@/lib/utils';
import type { Pokemon } from '@/types/pokemon';
import { memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PokemonAbilities from './Abilities';
import PokemonEVs from './EVs';
import PokemonImage from './Image';
import PokemonName from './Name';
import PokemonNumber from './Number';
import PokemonTypes from './Types';

interface PokemonCardProps {
  pokemon: Pokemon;
  isShiny?: boolean;
  isShowEV?: boolean;
  isShowAbility?: boolean;
}

const PokemonCard = memo(function PokemonCard({
  pokemon,
  isShiny = false,
  isShowEV = false,
  isShowAbility = true,
}: PokemonCardProps) {
  const location = useLocation();

  // Memoize expensive color class calculations
  const colorClasses = useMemo(() => {
    const primaryType = pokemon.types[0];
    const secondaryType = pokemon.types[1] || pokemon.types[0];

    return cn(
      FromClass[primaryType as keyof typeof FromClass],
      ToClass[secondaryType as keyof typeof ToClass],
    );
  }, [pokemon.types]);

  const handleClick = () => {
    // Store current URL (including search params) for the back button
    const currentUrl = location.pathname + location.search;
    sessionStorage.setItem('pokemonListReferrer', currentUrl);

    // Track Pokemon card click
    trackEvent('click', 'pokemon_card', pokemon.name.en);

    // Track custom event with more details
    trackCustomEvent('pokemon_card_click', {
      pokemon_name: pokemon.name.en,
      pokemon_id: pokemon.pid,
      pokemon_type_primary: pokemon.types[0],
      pokemon_type_secondary: pokemon.types[1] || null,
      page_location: location.pathname,
    });
  };

  const pokedexId = pokemon.pid;

  return (
    <Link
      to={`/pokemon/${pokemon.pid}`}
      className='group cursor-pointer w-fit'
      onClick={handleClick}
    >
      <div
        className={cn(
          'w-36 p-2 pt-6 flex flex-col items-center',
          'rounded-xl',
          'shadow-list-items',
          'bg-white',
          'relative',
          'bg-linear-to-tl',
          colorClasses,
          'transition-all duration-300 ease-in-out',
          'hover:shadow-xl hover:-translate-y-2 hover:bg-sky-200/60',
        )}
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
        }}
      >
        <div className='absolute -top-4 -left-2 group-hover:-translate-x-2 group-hover:-translate-y-1 transition-all duration-300'>
          <PokemonNumber number={pokedexId} />
        </div>
        <PokemonImage pokemon={pokemon} pokedexId={pokedexId} isShiny={isShiny} />
        <div className='flex flex-col gap-2 mb-2'>
          <PokemonName name={pokemon.name} />
          <PokemonTypes types={pokemon.types} />
          {isShowAbility && <PokemonAbilities abilities={pokemon.abilities} />}
          {isShowEV && <PokemonEVs ev={pokemon.ev} />}
        </div>
      </div>
    </Link>
  );
});

export default PokemonCard;
