import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface AbilityToggleProps {
  isShowAbility: boolean;
  onToggle: () => void;
}

function AbilityToggle({ isShowAbility, onToggle }: AbilityToggleProps) {
  const handleToggle = () => {
    // Track Ability toggle
    trackCustomEvent('ability_toggle', {
      new_state: !isShowAbility,
      previous_state: isShowAbility,
    });

    onToggle();
  };

  return (
    <div className='flex gap-2 items-center'>
      <div className='flex flex-col justify-center h-10'>
        <button
          type='button'
          onClick={handleToggle}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
            isShowAbility ? 'bg-green-600' : 'bg-slate-300',
          )}
          role='switch'
          aria-checked={isShowAbility}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
              isShowAbility ? 'translate-x-6' : 'translate-x-1',
            )}
          />
        </button>
      </div>
      <span>特性</span>
    </div>
  );
}

export default AbilityToggle;
