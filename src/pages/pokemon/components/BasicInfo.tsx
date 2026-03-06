import { PokemonTypes } from '@/components/pokemon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/Loading';
import { ShareButton } from '@/components/ui/share-button';
import type { DetailedPokemon } from '@/types/pokemon';
import type { JSX } from 'react';
import { TypeWeakness } from './TypeWeakness';

interface BasicInfoProps {
  pokemon: DetailedPokemon;
  loading: boolean;
}

type ContentProps = { pokemon: DetailedPokemon };

const genderRatioMap = {
  0: [100, 0],
  1: [87.5, 12.5],
  2: [75, 25],
  4: [50, 50],
  6: [25, 75],
  7: [12.5, 87.5],
  8: [0, 100],
  '-1': [0, 0],
};

type Render = {
  title: string;
  Content: ({ pokemon }: ContentProps) => JSX.Element;
};

export default function BasicInfo({ pokemon, loading = false }: BasicInfoProps) {
  const renderData: Render[] = [
    {
      title: 'National ID',
      Content: ({ pokemon }: ContentProps) => <>#{pokemon.pid.toString().padStart(4, '0')}</>,
    },
    {
      title: 'Name(zh)',
      Content: ({ pokemon }: ContentProps) => (
        <a
          href={`https://wiki.52poke.com/zh-hant/${pokemon.name.zh}`}
          target='_blank'
          rel='noreferrer'
          className='inline text-blue-800 underline'
        >
          {pokemon.name.zh}
        </a>
      ),
    },
    {
      title: 'Name(en)',
      Content: ({ pokemon }: ContentProps) => (
        <a
          href={`https://www.serebii.net/pokedex-rs/${pokemon.pid.toString().padStart(3, '0')}.shtml`}
          target='_blank'
          rel='noreferrer'
          className='inline text-blue-800 underline'
        >
          {pokemon.name.en}
        </a>
      ),
    },
    {
      title: 'Name(jp)',
      Content: ({ pokemon }: ContentProps) => <>{pokemon.name.ja}</>,
    },
    {
      title: 'Types',
      Content: ({ pokemon }: ContentProps) => <PokemonTypes types={pokemon.types} />,
    },
    {
      title: 'Abilities',
      Content: ({ pokemon }: ContentProps) => (
        <div className='flex gap-2'>
          {pokemon.abilities.map((ability) => (
            <a
              key={ability.en}
              href={`https://wiki.52poke.com/zh-hant/${ability.zh}（特性）`}
              target='_blank'
              rel='noreferrer'
              className='inline text-blue-800 underline'
            >
              {ability.zh}
            </a>
          ))}
        </div>
      ),
    },
    {
      title: 'Egg Groups',
      Content: ({ pokemon }: ContentProps) => (
        <div className='flex gap-2'>
          {pokemon.eggGroups.map((eggGroup) => (
            <a
              key={eggGroup}
              href={`https://wiki.52poke.com/zh-hant/${eggGroup}（蛋群）`}
              target='_blank'
              rel='noreferrer'
              className='inline text-blue-800 underline'
            >
              {eggGroup}
            </a>
          ))}
        </div>
      ),
    },
    {
      title: 'Gender Ratio',
      Content: ({ pokemon }: ContentProps) => (
        <span className='flex gap-4 whitespace-nowrap'>
          <span>♂：{genderRatioMap[pokemon.genderRate as keyof typeof genderRatioMap][0]}%</span>
          <span>♀：{genderRatioMap[pokemon.genderRate as keyof typeof genderRatioMap][1]}%</span>
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Basic Information
          <ShareButton title={`${pokemon.name.zh}`} className='w-6 h-6' />
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex justify-around'>
          {loading ? (
            <>
              <Loading size='h-[160px]' />
              <Loading size='h-[160px]' />
            </>
          ) : (
            <>
              <img
                src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.pid}.png`}
                alt={pokemon.name.zh}
              />
              <img
                src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.pid}s.png`}
                alt={pokemon.name.zh}
              />
            </>
          )}
        </div>
        <div className='space-y-2'>
          {renderData.map((data, index) => (
            <div className='flex justify-between' key={index}>
              <span className='text-sm text-gray-500'>{data.title}:</span>
              <span className='font-medium'>
                <data.Content pokemon={pokemon} />
              </span>
            </div>
          ))}
          <TypeWeakness pokemon={pokemon} />
        </div>
      </CardContent>
    </Card>
  );
}
