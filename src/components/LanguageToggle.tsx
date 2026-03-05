import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { displayLanguage, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 flex items-center justify-center gap-2 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer group"
      title="Toggle Language Display (Zho/Ja or Zho/En)"
    >
      <Languages size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
      <span className="text-xs font-bold font-mono w-6 text-center select-none uppercase">
        {displayLanguage}
      </span>
    </button>
  );
}
