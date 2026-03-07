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
        <div className='flex justify-center'>
          <div className=''>
            <div className='w-4/5 md:w-2/3 mx-auto'>
              <RadarChart stats={pokemon.base} EVs={pokemon.ev} />
            </div>
            <Statistic pokemon={pokemon} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
