import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { displayLanguage, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      type='button'
      className={cn(
        'w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_0_rgba(203,213,225,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer group flex-shrink-0',
        className,
      )}
      title={`Switch Language (Current: ${displayLanguage.toUpperCase()})`}
      aria-label={`Switch Language (Current: ${displayLanguage.toUpperCase()})`}
    >
      <span className='font-press-start text-[11px] font-bold text-blue-600 group-hover:scale-110 transition-transform select-none'>
        {displayLanguage.toUpperCase()}
      </span>
    </button>
  );
}
