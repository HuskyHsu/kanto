import PageViewToggle from '@/components/PageViewToggle';
import { useAbilityToggle } from '@/hooks/useAbilityToggle';
import { useEVToggle } from '@/hooks/useEVToggle';
import { usePokemonData } from '@/hooks/usePokemonData';
import { usePokemonFilter } from '@/hooks/usePokemonFilter';
import { useShinyToggle } from '@/hooks/useShinyToggle';
import { useEffect } from 'react';
import {
  AbilityToggle,
  EVFilter,
  EVToggle,
  FinalFormToggle,
  PageContent,
  PageHeader,
  PokedexToggle,
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
    selectedPokedex,
    setSelectedPokedex,
    filteredPokemonList,
    selectedEVStat,
    setSelectedEVStat,
  } = usePokemonFilter(pokemonList);
  const { isShiny, toggleShiny } = useShinyToggle();
  const { isShowEV, toggleEV } = useEVToggle();
  const { isShowAbility, toggleAbility } = useAbilityToggle();

  useEffect(() => {
    document.title = 'FireRed & LeafGreen Pokédex';
  }, []);

  return (
    <div className='space-y-6'>
      <PageHeader />
      <PageViewToggle />
      <PokedexToggle selectedPokedex={selectedPokedex} onPokedexChange={setSelectedPokedex} />
      <SearchFilter searchKeyword={searchKeyword} onSearchChange={setSearchKeyword} />
      <TypeFilter selectedTypes={selectedTypes} onTypeChange={setSelectedTypes} />
      <div className='flex gap-y-0 gap-x-4 mb-2 flex-wrap'>
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

export default Home;
