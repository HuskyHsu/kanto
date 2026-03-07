import { PokemonTypes } from '@/components/pokemon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { DetailedPokemon } from '@/types/pokemon';
import { useState } from 'react';
import MoveRow from './MoveRow';

interface MovesCardProps {
  pokemon: DetailedPokemon;
}

export default function MovesCard({ pokemon }: MovesCardProps) {
  const { displayLanguage } = useLanguage();

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allMoves = [
    ...pokemon.levelUpMoves,
    ...pokemon.TMMoves,
    ...pokemon.HTMMoves,
    ...pokemon.eggMoves,
    ...pokemon.tutorMoves,
  ];

  const uniqueTypes = Array.from(new Set(allMoves.map((m) => m.type))).sort();
  const categories = ['Physical', 'Special', 'Status'];

  const filterMove = (
    move:
      | DetailedPokemon['levelUpMoves'][0]
      | DetailedPokemon['TMMoves'][0]
      | DetailedPokemon['HTMMoves'][0]
      | DetailedPokemon['eggMoves'][0]
      | DetailedPokemon['tutorMoves'][0],
  ) => {
    if (!move) return false;
    const typeMatch = selectedType === null || move.type === selectedType;
    const categoryMatch = selectedCategory === null || move.category === selectedCategory;
    return typeMatch && categoryMatch;
  };

  const toggleType = (type: string) => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <Card className='lg:col-span-2 border-[3px] border-[#34925e] rounded-[10px] bg-white shadow-none'>
      <CardHeader>
        <CardTitle className='font-press-start text-lg uppercase tracking-wider text-slate-800 relative pl-4 before:content-[""] before:absolute before:left-0 before:top-[15%] before:h-[70%] before:w-1 before:bg-[#e05038]'>
          Moves
        </CardTitle>
      </CardHeader>
      <CardContent className='px-0 md:px-6 font-mono tracking-tighter'>
        <div className='mb-6 -mt-4 space-y-4 px-6 md:px-0'>
          <p className='text-sm font-semibold'>Type:</p>
          <div className='flex flex-wrap gap-2 items-center'>
            {uniqueTypes.map((type) => {
              const isSelected = selectedType === type;
              const shouldFade = selectedType !== null && !isSelected;

              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={cn(
                    'flex items-center justify-center rounded-lg transition-all duration-100',
                    shouldFade ? 'opacity-30' : 'opacity-100',
                    'hover:scale-110 active:scale-90',
                  )}
                  title={type}
                >
                  <PokemonTypes types={[type]} className='w-8 h-8' />
                </button>
              );
            })}
          </div>
          <p className='text-sm font-semibold'>Category:</p>
          <div className='flex flex-wrap gap-2 items-center'>
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const shouldFade = selectedCategory !== null && !isSelected;

              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    'flex items-center justify-center rounded-lg transition-all duration-100',
                    'border-2 border-[#34925e] bg-white hover:border-[#2a754b]',
                    shouldFade ? 'opacity-30' : 'opacity-100',
                    'hover:scale-110 active:scale-90',
                  )}
                  title={category}
                >
                  <PokemonTypes types={[category]} className='w-8 h-8' />
                </button>
              );
            })}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 text-center mt-4'>
          <div className='bg-slate-50 p-2 sm:p-4 rounded-xl border-2 border-slate-200'>
            <h4 className='font-press-start text-sm mb-4 text-slate-700 bg-white inline-block px-4 py-2 border-2 border-[#34925e] rounded shadow-[2px_2px_0_0_#34925e]'>
              Level Up Moves
            </h4>
            <Table>
              <TableHeader>
                <TableRow className=''>
                  <TableHead className='w-2/12 min-w-[60px]'>Lv</TableHead>
                  <TableHead className='w-3/12'>Name</TableHead>
                  <TableHead className='w-2/12'>Type</TableHead>
                  <TableHead className='w-2/12'>Cat.</TableHead>
                  <TableHead className='w-1/12'>Att.</TableHead>
                  <TableHead className='w-1/12'>Acc.</TableHead>
                  <TableHead className='w-1/12'>PP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pokemon.levelUpMoves.filter(filterMove).map((move) => {
                  let from: React.ReactNode = '—';
                  if (move.level < 0) {
                    from = (
                      <div className='flex flex-col text-[10px] leading-tight text-slate-500 font-bold font-sans'>
                        <span>{move.preEvoName?.zh}</span>
                        <span>Lv.{Math.abs(move.level)}</span>
                      </div>
                    );
                  } else if (move.level > 1) {
                    from = move.level;
                  } else if (move.level === 0) {
                    from = 'Evolve';
                  }

                  return (
                    <MoveRow key={move.id} moveId={move.id} colSpan={7}>
                      <TableCell className='px-0'>{from}</TableCell>
                      <TableCell className='px-0'>
                        <a
                          href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                          target='_blank'
                          rel='noreferrer'
                          className='inline text-blue-800 underline'
                        >
                          {move.name.zh}
                        </a>
                        <br />
                        {displayLanguage === 'ja' ? move.name.ja : move.name.en}
                      </TableCell>
                      <TableCell>
                        <div className='flex justify-center'>
                          <PokemonTypes types={[move.type]} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex justify-center'>
                          <PokemonTypes types={[move.category]} />
                        </div>
                      </TableCell>
                      <TableCell>{move.power <= 0 ? '—' : move.power}</TableCell>
                      <TableCell>{move.accuracy ?? '—'}</TableCell>
                      <TableCell>{move.pp}</TableCell>
                    </MoveRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className='bg-slate-50 p-2 sm:p-4 rounded-xl border-2 border-slate-200'>
            <h4 className='font-press-start text-sm mb-4 text-slate-700 bg-white inline-block px-4 py-2 border-2 border-[#34925e] rounded shadow-[2px_2px_0_0_#34925e]'>
              TM Moves
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-2/12 min-w-[60px]'>TM</TableHead>
                  <TableHead className='w-3/12'>Name</TableHead>
                  <TableHead className='w-2/12'>Type</TableHead>
                  <TableHead className='w-2/12'>Cat.</TableHead>
                  <TableHead className='w-1/12'>Att.</TableHead>
                  <TableHead className='w-1/12'>Acc.</TableHead>
                  <TableHead className='w-1/12'>PP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...pokemon.HTMMoves, ...pokemon.TMMoves].filter(filterMove).map((move) => (
                  <MoveRow key={move.id} moveId={move.id} colSpan={6}>
                    <TableCell className='px-0'>
                      {!move.isPreEvo ? (
                        move.tm
                      ) : (
                        <div className='flex flex-col text-[10px] leading-tight text-slate-500 font-bold font-sans'>
                          <span>{move.preEvoName?.zh}</span>
                          <span>{move.tm}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='px-0'>
                      <a
                        href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                        target='_blank'
                        rel='noreferrer'
                        className='inline text-blue-800 underline'
                      >
                        {move.name.zh}
                      </a>
                      <br />
                      {displayLanguage === 'ja' ? move.name.ja : move.name.en}
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.type]} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.category]} />
                      </div>
                    </TableCell>
                    <TableCell>{move.power <= 0 ? '—' : move.power}</TableCell>
                    <TableCell>{move.accuracy ?? '—'}</TableCell>
                    <TableCell>{move.pp}</TableCell>
                  </MoveRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='bg-slate-50 p-2 sm:p-4 rounded-xl border-2 border-slate-200'>
            <h4 className='font-press-start text-sm mb-4 text-slate-700 bg-white inline-block px-4 py-2 border-2 border-[#34925e] rounded shadow-[2px_2px_0_0_#34925e]'>
              Egg Moves
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-3/12'>Name</TableHead>
                  <TableHead className='w-2/12'>Type</TableHead>
                  <TableHead className='w-2/12'>Cat.</TableHead>
                  <TableHead className='w-1/12'>Att.</TableHead>
                  <TableHead className='w-1/12'>Acc.</TableHead>
                  <TableHead className='w-1/12'>PP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pokemon.eggMoves.filter(filterMove).map((move) => (
                  <MoveRow key={move.id} moveId={move.id} colSpan={6}>
                    <TableCell className='px-0'>
                      <a
                        href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                        target='_blank'
                        rel='noreferrer'
                        className='inline text-blue-800 underline'
                      >
                        {move.name.zh}
                      </a>
                      <br />
                      {displayLanguage === 'ja' ? move.name.ja : move.name.en}
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.type]} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.category]} />
                      </div>
                    </TableCell>
                    <TableCell>{move.power <= 0 ? '—' : move.power}</TableCell>
                    <TableCell>{move.accuracy ?? '—'}</TableCell>
                    <TableCell>{move.pp}</TableCell>
                  </MoveRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='bg-slate-50 p-2 sm:p-4 rounded-xl border-2 border-slate-200'>
            <h4 className='font-press-start text-sm mb-4 text-slate-700 bg-white inline-block px-4 py-2 border-2 border-[#34925e] rounded shadow-[2px_2px_0_0_#34925e]'>
              Tutor Moves
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-3/12'>Name</TableHead>
                  <TableHead className='w-2/12'>Type</TableHead>
                  <TableHead className='w-2/12'>Cat.</TableHead>
                  <TableHead className='w-1/12'>Att.</TableHead>
                  <TableHead className='w-1/12'>Acc.</TableHead>
                  <TableHead className='w-1/12'>PP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pokemon.tutorMoves.filter(filterMove).map((move) => (
                  <MoveRow key={move.id} moveId={move.id} colSpan={6}>
                    <TableCell className='px-0'>
                      <a
                        href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                        target='_blank'
                        rel='noreferrer'
                        className='inline text-blue-800 underline'
                      >
                        {move.name.zh}
                      </a>
                      <br />
                      {displayLanguage === 'ja' ? move.name.ja : move.name.en}
                      {move.isPreEvo && (
                        <div className='text-[10px] leading-tight text-slate-500 font-bold font-sans mt-1'>
                          ({move.preEvoName?.zh} 教授)
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.type]} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.category]} />
                      </div>
                    </TableCell>
                    <TableCell>{move.power <= 0 ? '—' : move.power}</TableCell>
                    <TableCell>{move.accuracy ?? '—'}</TableCell>
                    <TableCell>{move.pp}</TableCell>
                  </MoveRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
