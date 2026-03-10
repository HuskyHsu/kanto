import { PokemonTypes } from '@/components/pokemon';
import { POKEMON_TYPES } from '@/lib/constants/pokemon';
import { cn } from '@/lib/utils';

export const categoryMap = {
  water: 'Special',
  grass: 'Special',
  fire: 'Special',
  ice: 'Special',
  electric: 'Special',
  psychic: 'Special',
  dragon: 'Special',
  dark: 'Special',

  fighting: 'Physical',
  poison: 'Physical',
  ground: 'Physical',
  flying: 'Physical',
  bug: 'Physical',
  rock: 'Physical',
  ghost: 'Physical',
  steel: 'Physical',
  fairy: 'Physical',
  normal: 'Physical',
} as const;

interface MoveFilterProps {
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  isTM: boolean;
  onTMChange: (isTM: boolean) => void;
}

export default function MoveFilter({
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  isTM,
  onTMChange,
}: MoveFilterProps) {
  // All 18 Pokemon types mapped by physical/special
  const physicalTypes = POKEMON_TYPES.filter(
    (type) => categoryMap[type.toLowerCase() as keyof typeof categoryMap] === 'Physical'
  );
  const specialTypes = POKEMON_TYPES.filter(
    (type) => categoryMap[type.toLowerCase() as keyof typeof categoryMap] === 'Special'
  );


  const categories = ['Physical', 'Special', 'Status'];

  const toggleType = (type: string) => {
    onTypeChange(selectedType === type ? null : type);
  };

  const toggleCategory = (category: string) => {
    onCategoryChange(selectedCategory === category ? null : category);
  };

  return (
    <div className='mb-6 space-y-4'>
      <h2 className='-ml-2 text-sm font-semibold text-slate-700 mb-2 flex items-center font-press-start'>
        <img
          src={`${import.meta.env.BASE_URL}images/type/Move_.png`}
          className='w-10 h-10'
        />
        Type Filter
      </h2>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-wrap gap-2 items-center'>
          <div className='w-full sm:w-20 shrink-0 text-xs font-semibold text-slate-500 font-press-start flex items-center gap-1 opacity-70' title='Physical'>
            <PokemonTypes types={['Physical']} className='w-6 h-6' />
            <span className='scale-75 origin-left'>Physical</span>
          </div>
          {physicalTypes.map((type) => {
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

        <div className='flex flex-wrap gap-2 items-center'>
          <div className='w-full sm:w-20 shrink-0 text-xs font-semibold text-slate-500 font-press-start flex items-center gap-1 opacity-70' title='Special'>
            <PokemonTypes types={['Special']} className='w-6 h-6' />
            <span className='scale-75 origin-left'>Special</span>
          </div>
          {specialTypes.map((type) => {
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
      </div>

      <h2 className='-ml-2 text-sm font-semibold text-slate-700 mb-2 flex items-center font-press-start'>
        <img
          src={`${import.meta.env.BASE_URL}images/type/Move_.png`}
          className='w-10 h-10'
        />
        Category Filter
      </h2>
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
                'border-gray-200 bg-white hover:border-gray-300 border',
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

      <div className='flex gap-3 items-center font-press-start'>
        <div className='flex flex-col justify-center h-10'>
          <button
            type='button'
            onClick={() => onTMChange(!isTM)}
            className={cn(
              'relative inline-flex h-6 w-10 items-center border-2 border-[#34925e] rounded-md',
              'transition-colors duration-100 ease-linear cursor-pointer',
              'focus:outline-none shadow-[2px_2px_0_0_rgba(52,146,94,0.3)]',
              isTM ? 'bg-[#34925e]' : 'bg-white',
            )}
            role='switch'
            aria-checked={isTM}
          >
            <span
              className={cn(
                'inline-block h-[14px] w-[14px] transform transition-transform duration-100 ease-linear rounded-xs',
                isTM ? 'translate-x-[18px] bg-white' : 'translate-x-[4px] bg-[#34925e]',
              )}
            />
          </button>
        </div>
        <span className='text-[10px] text-slate-700 font-semibold Kantoleading-none'>TM</span>
      </div>

    </div>
  );
}
