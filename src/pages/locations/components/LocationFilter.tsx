import { cn } from '@/lib/utils';

interface LocationFilterProps {
  selectedRegion: string | null;
  onRegionChange: (region: string | null) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedVersion: string | null;
  onVersionChange: (version: string | null) => void;
}

const REGION_OPTIONS = [
  { value: null, label: 'All' },
  { value: 'kanto', label: 'Kanto (關都)' },
  { value: 'sevii', label: 'Sevii Islands (七之島)' },
];

const CATEGORY_OPTIONS = [
  { value: null, label: 'All' },
  { value: 'route', label: 'Routes (道路/水路)' },
  { value: 'dungeon', label: 'Dungeons (洞窟/迷宮)' },
  { value: 'city', label: 'Cities (城鎮/水域)' },
  { value: 'special', label: 'Special (特殊)' },
];

const VERSION_OPTIONS = [
  { value: null, label: 'All' },
  { value: 'firered', label: '🔥 FireRed (火紅限定)' },
  { value: 'leafgreen', label: '🍃 LeafGreen (葉綠限定)' },
];

export default function LocationFilter({
  selectedRegion,
  onRegionChange,
  selectedCategory,
  onCategoryChange,
  selectedVersion,
  onVersionChange,
}: LocationFilterProps) {
  const buttonStyle = (isSelected: boolean, activeColorClass = 'bg-[#34925e] text-white') =>
    cn(
      'relative px-3 py-2 text-[10px] uppercase font-semibold leading-none rounded-[10px] transition-all duration-100 ease-linear cursor-pointer font-press-start',
      'border-2 border-[#34925e] focus:outline-none focus:ring-2 focus:ring-[#34925e] focus:ring-offset-2',
      'shadow-[2px_2px_0_0_rgba(52,146,94,0.3)] hover:-translate-y-0.5 hover:shadow-[2px_4px_0_0_rgba(52,146,94,0.3)]',
      isSelected
        ? activeColorClass
        : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50',
    );

  return (
    <div className='mb-6 space-y-4'>
      {/* Region Filter */}
      <div>
        <h2 className='-ml-2 text-sm font-semibold text-slate-700 mb-2 flex items-center font-press-start'>
          <img
            src={`${import.meta.env.BASE_URL}images/type/PokemonBall_.png`}
            className='w-10 h-10'
            alt='Ball'
          />
          Region Filter
        </h2>
        <div className='flex flex-wrap gap-2 items-center'>
          {REGION_OPTIONS.map((opt) => (
            <button
              key={opt.value || 'all-reg'}
              type='button'
              onClick={() => onRegionChange(opt.value)}
              className={buttonStyle(
                selectedRegion === opt.value,
                opt.value === 'kanto'
                  ? 'bg-linear-to-r from-red-600 to-green-600 text-white'
                  : opt.value === 'sevii'
                    ? 'bg-linear-to-r from-[#FFDF00] via-[#C0C0C0] to-violet-600 text-white'
                    : 'bg-[#34925e] text-white',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h2 className='-ml-2 text-sm font-semibold text-slate-700 mb-2 flex items-center font-press-start'>
          <img
            src={`${import.meta.env.BASE_URL}images/type/Move_.png`}
            className='w-10 h-10'
            alt='Category'
          />
          Category Filter
        </h2>
        <div className='flex flex-wrap gap-2 items-center'>
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value || 'all-cat'}
              type='button'
              onClick={() => onCategoryChange(opt.value)}
              className={buttonStyle(selectedCategory === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Version Filter */}
      <div>
        <h2 className='-ml-2 text-sm font-semibold text-slate-700 mb-2 flex items-center font-press-start'>
          <img
            src={`${import.meta.env.BASE_URL}images/type/Move_.png`}
            className='w-10 h-10'
            alt='Version'
          />
          Version Filter
        </h2>
        <div className='flex flex-wrap gap-2 items-center'>
          {VERSION_OPTIONS.map((opt) => (
            <button
              key={opt.value || 'all-ver'}
              type='button'
              onClick={() => onVersionChange(opt.value)}
              className={buttonStyle(
                selectedVersion === opt.value,
                opt.value === 'firered'
                  ? 'bg-red-600 text-white border-red-600'
                  : opt.value === 'leafgreen'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-[#34925e] text-white',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
