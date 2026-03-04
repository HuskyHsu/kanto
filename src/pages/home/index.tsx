import { PokemonCard } from '@/components/pokemon';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ShareButton } from '@/components/ui/share-button';
import { useAbilityToggle } from '@/hooks/useAbilityToggle';
import { useEVToggle } from '@/hooks/useEVToggle';
import { usePokemonData } from '@/hooks/usePokemonData';
import { usePokemonFilter } from '@/hooks/usePokemonFilter';
import { useShinyToggle } from '@/hooks/useShinyToggle';
import type { PokemonList } from '@/types/pokemon';
import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AbilityToggle,
  EVFilter,
  EVToggle,
  FinalFormToggle,
  PWAInstallButton,
  SearchFilter,
  ShinyToggle,
  TypeFilter,
} from './components';

function Home() {
  const { pokemonList, loading, error } = usePokemonData();
  const {
    selectedTypes,
    setSelectedTypes,
    searchKeyword,
    setSearchKeyword,
    isFinalFormOnly,
    toggleFinalFormOnly,
    // selectedPokedex,
    // setSelectedPokedex,
    filteredPokemonList,
    selectedEVStat,
    setSelectedEVStat,
  } = usePokemonFilter(pokemonList);
  const { isShiny, toggleShiny } = useShinyToggle();
  const { isShowEV, toggleEV } = useEVToggle();
  const { isShowAbility, toggleAbility } = useAbilityToggle();

  useEffect(() => {
    document.title = 'Kanto Pokédex App';
  }, []);

  return (
    <div className='space-y-6'>
      <PageHeader />
      <PWAInstallButton />
      {/* <PageViewToggle /> */}
      <SearchFilter searchKeyword={searchKeyword} onSearchChange={setSearchKeyword} />
      <TypeFilter selectedTypes={selectedTypes} onTypeChange={setSelectedTypes} />
      <div className='flex gap-4 mb-2'>
        <ShinyToggle isShiny={isShiny} onToggle={toggleShiny} />
        <FinalFormToggle isFinalFormOnly={isFinalFormOnly} onToggle={toggleFinalFormOnly} />
        <AbilityToggle isShowAbility={isShowAbility} onToggle={toggleAbility} />
        <EVToggle isShowEV={isShowEV} onToggle={toggleEV} />
      </div>
      {isShowEV && <EVFilter selectedEVStat={selectedEVStat} onSelectEVStat={setSelectedEVStat} />}
      <PageContent
        loading={loading}
        error={error}
        pokemonList={filteredPokemonList}
        isShiny={isShiny}
        isShowEV={isShowEV}
        isShowAbility={isShowAbility}
      />
    </div>
  );
}

function PageHeader() {
  return (
    <h1 className='flex items-end gap-2 text-3xl font-bold'>
      <img src={`${import.meta.env.BASE_URL}images/appIcon/mega_symbol.svg`} className='w-8 h-8' />
      <Link to={`/`}>Kanto Pokédex</Link>
      <ShareButton title='Kanto Pokédex' />
    </h1>
  );
}

interface PageContentProps {
  loading: boolean;
  error: string | null;
  pokemonList: PokemonList;
  isShiny: boolean;
  isShowEV: boolean;
  isShowAbility: boolean;
}

function PageContent({
  loading,
  error,
  pokemonList,
  isShiny,
  isShowEV,
  isShowAbility,
}: PageContentProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <PokemonGrid
      pokemonList={pokemonList}
      isShiny={isShiny}
      isShowEV={isShowEV}
      isShowAbility={isShowAbility}
    />
  );
}

interface PokemonGridProps {
  pokemonList: PokemonList;
  isShiny: boolean;
  isShowEV: boolean;
  isShowAbility: boolean;
}

const PokemonGrid = memo(function PokemonGrid({
  pokemonList,
  isShiny,
  isShowEV,
  isShowAbility,
}: PokemonGridProps) {
  return (
    <div className='mt-12 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 justify-items-center gap-x-3 gap-y-16 text-slate-800 transition-all duration-200 ease-in-out'>
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

export default Home;
