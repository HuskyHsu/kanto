import { EV_STATS } from '@/lib/constants/pokemon';
import type { Pokedex, Pokemon, PokemonList } from '@/types/pokemon';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUrlParams } from './useUrlParams';

export function usePokemonFilter(pokemonList: PokemonList) {
  const { getArrayParam, getParam, getBooleanParam, setArrayParam, setParam, setBooleanParam } =
    useUrlParams();

  // Get setSearchParams directly from useSearchParams for batch updates
  const [, setSearchParams] = useSearchParams();

  const selectedTypes = getArrayParam('types');
  const searchKeyword = getParam('search') || '';
  const isFinalFormOnly = getBooleanParam('finalForm', false);
  const selectedPokedex = (getParam('Pokedex') as Pokedex) || 'kanto';
  const selectedEVStat = getParam('evStat') || '';

  // Memoize the type checking function to avoid recreating it on every render
  const typeMatches = useCallback((pokemonTypes: string[], filterTypes: string[]) => {
    return filterTypes.every((selectedType) => pokemonTypes.includes(selectedType));
  }, []);

  // Memoize the keyword matching function
  const keywordMatches = useCallback((pokemon: Pokemon, keyword: string) => {
    if (!keyword.trim()) return true;

    const normalizedKeyword = keyword.toLowerCase().trim();

    // Search in names (zh, ja, en)
    const nameMatches =
      pokemon.name.zh.toLowerCase().includes(normalizedKeyword) ||
      pokemon.name.ja.toLowerCase().includes(normalizedKeyword) ||
      pokemon.name.en.toLowerCase().includes(normalizedKeyword);

    // Search in pid (convert to string for searching)
    const pidMatches = pokemon.pid.toString().includes(normalizedKeyword);

    const abilitiesMatches =
      pokemon.abilities.some((ability) =>
        ability.zh.toLowerCase().includes(normalizedKeyword) ||
        ability.ja.toLowerCase().includes(normalizedKeyword) ||
        ability.en.toLowerCase().includes(normalizedKeyword)
      );

    return nameMatches || pidMatches || abilitiesMatches;
  }, []);

  // Memoize the pokedex matching function
  const pokedexMatches = useCallback((pokemon: Pokemon, pokedex: Pokedex) => {
    if (pokedex === 'kanto') {
      return pokemon.pid <= 151;
    } else if (pokedex === 'national') {
      return true;
    }
    return true;
  }, []);

  // Memoize the EV matching function
  const evMatches = useCallback((pokemon: Pokemon, evStat: string) => {
    if (!evStat) return true;

    const index = EV_STATS.indexOf(evStat as (typeof EV_STATS)[number]);
    if (index === -1) return true;

    return pokemon.ev[index] > 0;
  }, []);

  // Function to filter only final evolution forms
  const getFinalFormPokemon = useCallback((pokemonList: PokemonList) => {
    return pokemonList.filter((pokemon) => pokemon.latest);
  }, []);

  const filteredPokemonList = useMemo(() => {
    let result = pokemonList;

    // Apply final form filter first if enabled
    if (isFinalFormOnly) {
      result = getFinalFormPokemon(result);
    }

    // Apply keyword filter
    if (searchKeyword.trim()) {
      result = result.filter((pokemon) => keywordMatches(pokemon, searchKeyword));
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      result = result.filter((pokemon) => typeMatches(pokemon.types, selectedTypes));
    }

    // Apply Pokedex filter
    result = result.filter((pokemon) => pokedexMatches(pokemon, selectedPokedex));

    // Apply EV filter
    if (selectedEVStat) {
      result = result.filter((pokemon) => evMatches(pokemon, selectedEVStat));
    }

    return result;
  }, [
    pokemonList,
    selectedTypes,
    searchKeyword,
    selectedPokedex,
    isFinalFormOnly,
    typeMatches,
    keywordMatches,
    pokedexMatches,
    evMatches,
    getFinalFormPokemon,
    selectedEVStat,
  ]);

  // Memoize the setters to prevent unnecessary re-renders
  const memoizedSetSelectedTypes = useCallback(
    (types: string[]) => {
      setArrayParam('types', types);
    },
    [setArrayParam],
  );

  const memoizedSetSearchKeyword = useCallback(
    (keyword: string) => {
      setParam('search', keyword);
    },
    [setParam],
  );

  const toggleFinalFormOnly = useCallback(() => {
    setBooleanParam('finalForm', !isFinalFormOnly, false);
  }, [setBooleanParam, isFinalFormOnly]);

  const memoizedSetSelectedPokedex = useCallback(
    (Pokedex: Pokedex) => {
      if (Pokedex === 'hyperspace' || Pokedex === 'national') {
        // Use a single setSearchParams call to update all parameters at once
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set('Pokedex', Pokedex);
          newParams.delete('zone');
          newParams.delete('alphaZone');
          return newParams;
        });
      } else {
        // Clear hyperspace specific params when switching back to kanto
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set('Pokedex', 'kanto');
          return newParams;
        });
      }
    },

    [setParam, setSearchParams],
  );

  const memoizedSetSelectedEVStat = useCallback(
    (evStat: string) => {
      setParam('evStat', evStat);
    },
    [setParam],
  );

  return {
    selectedTypes,
    setSelectedTypes: memoizedSetSelectedTypes,
    searchKeyword,
    setSearchKeyword: memoizedSetSearchKeyword,
    isFinalFormOnly,
    toggleFinalFormOnly,
    selectedPokedex,
    setSelectedPokedex: memoizedSetSelectedPokedex,
    filteredPokemonList,
    selectedEVStat,
    setSelectedEVStat: memoizedSetSelectedEVStat,
  };
}
