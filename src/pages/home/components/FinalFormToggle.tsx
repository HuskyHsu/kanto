import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface FinalFormToggleProps {
  isFinalFormOnly: boolean;
  onToggle: () => void;
}

function FinalFormToggle({ isFinalFormOnly, onToggle }: FinalFormToggleProps) {
  const handleToggle = () => {
    // Track final form toggle
    trackCustomEvent('final_form_toggle', {
      new_state: !isFinalFormOnly,
      previous_state: isFinalFormOnly,
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
            isFinalFormOnly ? 'bg-[#34925e]' : 'bg-white',
          )}
          role='switch'
          aria-checked={isFinalFormOnly}
        >
          <span
            className={cn(
              'inline-block h-[14px] w-[14px] transform transition-transform duration-100 ease-linear rounded-xs',
              isFinalFormOnly ? 'translate-x-[18px] bg-white' : 'translate-x-[4px] bg-[#34925e]',
            )}
          />
        </button>
      </div>
      <span className='text-[10px] text-slate-700 font-semibold leading-none'>Final Form</span>
    </div>
  );
}

export default FinalFormToggle;
