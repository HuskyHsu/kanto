import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DetailedPokemon } from '@/types/pokemon';
import { Evolution } from './Evolution';

interface EvolutionCardProps {
  pokemon: DetailedPokemon;
  onPokemonChange: (newLink: string) => Promise<void>;
}

export default function EvolutionCard({ pokemon, onPokemonChange }: EvolutionCardProps) {
  return (
    <Card className='lg:col-span-2 border-[3px] border-[#34925e] rounded-[10px] bg-white shadow-none'>
      <CardHeader>
        <CardTitle className='font-press-start text-lg uppercase tracking-wider text-slate-800 relative pl-4 before:content-[""] before:absolute before:left-0 before:top-[15%] before:h-[70%] before:w-1 before:bg-[#e05038]'>
          Evolution Chain
        </CardTitle>
      </CardHeader>
      <CardContent className='font-mono tracking-tighter'>
        <div className='flex justify-center'>
          <Evolution pokemon={pokemon} onPokemonChange={onPokemonChange} />
        </div>
      </CardContent>
    </Card>
  );
}
