import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DetailedPokemon } from '@/types/pokemon';
import { RadarChart } from './RadarChart';
import { Statistic } from './Statistic';

interface StatsCardProps {
  pokemon: DetailedPokemon;
}

export default function StatsCard({ pokemon }: StatsCardProps) {
  // const statNames = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];
  // const maxStat = Math.max(...pokemon.base);

  return (
    <Card className='border-[3px] border-[#34925e] rounded-[10px] bg-white shadow-none'>
      <CardHeader>
        <CardTitle className='font-press-start text-lg uppercase tracking-wider text-slate-800 relative pl-4 before:content-[""] before:absolute before:left-0 before:top-[15%] before:h-[70%] before:w-1 before:bg-[#e05038]'>
          Base Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardTitle className='text-sm mb-4 font-press-start text-slate-600'>
          Individual Values & Base points
        </CardTitle>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-6 items-center'>
          <div className='md:col-span-5 flex flex-col items-center justify-center'>
            <div className='w-4/5 sm:w-2/3 md:w-full max-w-[340px] mx-auto'>
              <RadarChart stats={pokemon.base} EVs={pokemon.ev} />
            </div>
          </div>
          <div className='md:col-span-7 w-full'>
            <Statistic pokemon={pokemon} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
