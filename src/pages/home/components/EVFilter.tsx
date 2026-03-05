import { trackCustomEvent } from '@/lib/analytics';
import { EV_STATS } from '@/lib/constants/pokemon';
import { cn } from '@/lib/utils';

interface EVFilterProps {
  selectedEVStat: string;
  onSelectEVStat: (stat: string) => void;
}

const EVFilter = ({ selectedEVStat, onSelectEVStat }: EVFilterProps) => {
  const handleStatClick = (stat: string) => {
    const newStat = selectedEVStat === stat ? '' : stat;
    onSelectEVStat(newStat);

    if (newStat) {
      trackCustomEvent('ev_filter_select', { stat: newStat });
    }
  };

  return (
    <div className='flex gap-2 mb-8 flex-wrap justify-center md:justify-start animate-fade-in'>
      {EV_STATS.map((stat) => (
        <button
          key={stat}
          type='button'
          onClick={() => handleStatClick(stat)}
          className={cn(
            'px-3 py-2 text-[10px] font-press-start leading-none rounded-md transition-all duration-100 ease-linear cursor-pointer',
            'border-2 border-[#34925e] shadow-[2px_2px_0_0_rgba(52,146,94,0.3)] active:translate-y-[2px] active:shadow-none',
            selectedEVStat === stat
              ? 'bg-[#34925e] text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50',
          )}
        >
          {stat}
        </button>
      ))}
    </div>
  );
};

export default EVFilter;
