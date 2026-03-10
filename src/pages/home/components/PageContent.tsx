import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { PokemonList } from '@/types/pokemon';
import { PokemonGrid } from './PokemonGrid';

export interface PageContentProps {
  loading: boolean;
  error: string | null;
  pokemonList: PokemonList;
  isShiny: boolean;
  isShowEV: boolean;
  isShowAbility: boolean;
}

export function PageContent({
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
