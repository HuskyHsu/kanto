import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface EVToggleProps {
  isShowEV: boolean;
  onToggle: () => void;
}

function EVToggle({ isShowEV, onToggle }: EVToggleProps) {
  const handleToggle = () => {
    // Track EV toggle
    trackCustomEvent('ev_toggle', {
      new_state: !isShowEV,
      previous_state: isShowEV,
    });

    onToggle();
  };

  return (
    <div className='flex gap-3 items-center font-press-start'>
      <div className='flex flex-col justify-center h-10'>
        <button
          type='button'
          onClick={handleToggle}
          className={cn(
            'relative inline-flex h-6 w-10 items-center border-2 border-[#34925e] rounded-md',
            'transition-colors duration-100 ease-linear cursor-pointer',
            'focus:outline-none shadow-[2px_2px_0_0_rgba(52,146,94,0.3)]',
            isShowEV ? 'bg-[#34925e]' : 'bg-white',
          )}
          role='switch'
          aria-checked={isShowEV}
        >
          <span
            className={cn(
              'inline-block h-[14px] w-[14px] transform transition-transform duration-100 ease-linear rounded-xs',
              isShowEV ? 'translate-x-[18px] bg-white' : 'translate-x-[4px] bg-[#34925e]',
            )}
          />
        </button>
      </div>
      <span className='text-[10px] text-slate-700 font-semibold leading-none'>EV</span>
    </div>
  );
}

export default EVToggle;
