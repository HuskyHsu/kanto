import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { fetchPokemonData } from '@/services/pokemonService';
import type { Pokemon } from '@/types/pokemon';

interface PokemonNavigationProps {
  currentPokemonLink: string;
  onPokemonChange: (newLink: string) => Promise<void>;
}

function PokemonNavigation({ currentPokemonLink, onPokemonChange }: PokemonNavigationProps) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const loadPokemonList = async () => {
      try {
        const data = await fetchPokemonData();
        setPokemonList(data);

        // Find current Pokemon index
        const index = data.findIndex((pokemon) => pokemon.pid.toString() === currentPokemonLink);
        setCurrentIndex(index);
      } catch (error) {
        console.error('Failed to load Pokemon list:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPokemonList();
  }, [currentPokemonLink]);

  // Check screen size for responsive navigation
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint in Tailwind
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (loading || currentIndex === -1) {
    return null;
  }

  // Get navigation Pokemon - responsive count based on screen size
  const getNavigationPokemon = () => {
    const navPokemon: Pokemon[] = [];
    const totalPokemon = pokemonList.length;
    const sideCount = isMobile ? 2 : 3; // Mobile: 2 on each side, Desktop: 3 on each side

    for (let i = -sideCount; i <= sideCount; i++) {
      let index = currentIndex + i;

      // Handle circular navigation
      if (index < 0) {
        index = totalPokemon + index;
      } else if (index >= totalPokemon) {
        index = index - totalPokemon;
      }

      navPokemon.push(pokemonList[index]);
    }

    return navPokemon;
  };

  const navigationPokemon = getNavigationPokemon();
  const totalPokemon = pokemonList.length;

  // Get previous and next Pokemon for arrow navigation
  const getPreviousPokemon = () => {
    const prevIndex = currentIndex - 1 < 0 ? totalPokemon - 1 : currentIndex - 1;
    return pokemonList[prevIndex];
  };

  const getNextPokemon = () => {
    const nextIndex = currentIndex + 1 >= totalPokemon ? 0 : currentIndex + 1;
    return pokemonList[nextIndex];
  };

  const previousPokemon = getPreviousPokemon();
  const nextPokemon = getNextPokemon();

  const handlePokemonNavigation = (pokemonLink: string) => {
    onPokemonChange(pokemonLink);
  };

  return (
    <div className='flex items-center justify-between md:justify-center gap-2 md:gap-4 py-3 px-2 md:px-4 bg-white border-[3px] border-[#34925e] rounded-[10px]'>
      {/* Previous Arrow */}
      <button
        onClick={() => handlePokemonNavigation(previousPokemon.pid.toString())}
        className='flex shrink-0 items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-sm border-2 border-slate-300 bg-white shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-100'
        title={`to ${previousPokemon.name.zh}`}
      >
        <ChevronLeft className='w-5 h-5 text-slate-700 stroke-3' />
      </button>

      {/* Pokemon Navigation List */}
      <div className={`flex items-center gap-2`}>
        {navigationPokemon.map((pokemon, index) => {
          const sideCount = isMobile ? 2 : 3;
          const isCurrent = index === sideCount; // Middle item is current (mobile: index 2, desktop: index 3)

          const pokemonNumber = pokemon.pid.toString().padStart(3, '0');

          return (
            <button
              key={pokemon.pid}
              onClick={() => handlePokemonNavigation(pokemon.pid.toString())}
              className={`flex flex-col flex-1 min-w-0 md:flex-none items-center p-1 md:p-2 rounded-lg transition-transform duration-100 ${
                isCurrent
                  ? 'bg-amber-100 shadow-[0_4px_0_0_rgba(251,191,36,1)] scale-110 border-2 border-amber-400 z-10'
                  : 'bg-white hover:bg-slate-50 border-2 border-transparent hover:border-slate-200 hover:scale-105'
              }`}
              title={pokemon.name.zh}
            >
              {/* Pokemon Icon */}
              <div
                className={`${
                  isMobile ? 'w-10 h-10' : 'w-12 h-12'
                } flex items-center justify-center`}
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.pid}.png`}
                  alt={pokemon.name.zh}
                  className='w-full h-full object-contain [image-rendering:pixelated] drop-shadow-[0_2px_0_rgba(0,0,0,0.1)]'
                  onError={(e) => {
                    // Fallback to a placeholder or hide image
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Pokemon Name */}
              <div
                className={`text-[10px] md:text-xs text-center mt-1 font-mono tracking-tighter w-full overflow-hidden`}
              >
                <div className='text-slate-500 font-bold'>#{pokemonNumber}</div>
                <div
                  className={`font-bold truncate ${isCurrent ? 'text-amber-800' : 'text-slate-700'}`}
                >
                  {pokemon.name.zh}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Arrow */}
      <button
        onClick={() => handlePokemonNavigation(String(nextPokemon.pid))}
        className='flex shrink-0 items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-sm border-2 border-slate-300 bg-white shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-100'
        title={`to ${nextPokemon.name.zh}`}
      >
        <ChevronRight className='w-5 h-5 text-slate-700 stroke-3' />
      </button>
    </div>
  );
}

export default PokemonNavigation;
