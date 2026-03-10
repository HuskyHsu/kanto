import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PageViewToggle() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentView = location.pathname.includes('moves') ? 'moves' : 'pokemon';

  const handleToggle = (view: 'pokemon' | 'moves') => {
    if (view === currentView) return;

    trackCustomEvent('Page_view_toggle', {
      new_view: view,
      previous_view: currentView,
    });

    navigate(view === 'moves' ? '/moves' : '/');
  };

  return (
    <div className='mb-6 flex gap-3 items-center font-press-start'>
      <div className='flex flex-col justify-center h-10'>
        <div className='flex gap-2 w-full'>
          <button
            type='button'
            onClick={() => handleToggle('pokemon')}
            className={cn(
              'relative flex flex-1 items-center justify-center gap-2 px-3 py-2 text-[10px] uppercase font-semibold leading-none rounded-[10px] transition-all duration-100 ease-linear cursor-pointer',
              'border-2 border-[#34925e] focus:outline-none focus:ring-2 focus:ring-[#34925e] focus:ring-offset-2',
              'shadow-[2px_2px_0_0_rgba(52,146,94,0.3)] hover:-translate-y-0.5 hover:shadow-[2px_4px_0_0_rgba(52,146,94,0.3)]',
              currentView === 'pokemon'
                ? 'bg-[#34925e] text-white'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50',
            )}
          >
            <img src={`${import.meta.env.BASE_URL}images/type/PokemonBall_.png`} className='w-5 h-5' />
            Pokemon
          </button>
          <button
            type='button'
            onClick={() => handleToggle('moves')}
            className={cn(
              'relative flex flex-1 items-center justify-center gap-2 px-3 py-2 text-[10px] uppercase font-semibold leading-none rounded-[10px] transition-all duration-100 ease-linear cursor-pointer',
              'border-2 border-[#34925e] focus:outline-none focus:ring-2 focus:ring-[#34925e] focus:ring-offset-2',
              'shadow-[2px_2px_0_0_rgba(52,146,94,0.3)] hover:-translate-y-0.5 hover:shadow-[2px_4px_0_0_rgba(52,146,94,0.3)]',
              currentView === 'moves'
                ? 'bg-[#34925e] text-white'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50',
            )}
          >
            <img src={`${import.meta.env.BASE_URL}images/type/Move_.png`} className='w-4 h-4' />
            Moves
          </button>
        </div>
      </div>
    </div>
  );
}
