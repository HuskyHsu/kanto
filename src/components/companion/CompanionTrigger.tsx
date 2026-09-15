import React from 'react';
import { useCompanion } from '@/contexts/CompanionContext';
import { useLocationData } from '@/hooks/useLocationData';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles, MapPin } from 'lucide-react';

export const CompanionTrigger: React.FC = () => {
  const { party, selectedLocationId, isOpen, setIsOpen } = useCompanion();
  const { locationList } = useLocationData();
  const { displayLanguage } = useLanguage();

  if (isOpen) return null;

  const currentLocation = locationList.find((loc) => loc.id === selectedLocationId);
  const locationName = currentLocation
    ? currentLocation.name.zh || currentLocation.name[displayLanguage]
    : null;

  return (
    <div className='fixed bottom-5 right-5 z-40'>
      <button
        onClick={() => setIsOpen(true)}
        className='group flex items-center gap-2.5 px-3 py-2 bg-white border-[3px] border-[#34925e] rounded-[12px] shadow-[3px_3px_0_0_rgba(52,146,94,0.3)] hover:shadow-[3px_4px_0_0_rgba(52,146,94,0.45)] hover:-translate-y-0.5 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all cursor-pointer'
        title='開啟冒險助手 (隊伍快捷 / 當前地圖雷達)'
      >
        {/* Sprites stack or Retro Pokeball icon */}
        {party.length > 0 ? (
          <div className='flex items-center -space-x-2 shrink-0'>
            {party.slice(0, 3).map((pid) => (
              <div
                key={pid}
                className='w-7 h-7 rounded-lg bg-slate-50 border-2 border-slate-300 flex items-center justify-center p-0.5 shadow-2xs group-hover:scale-105 transition-transform'
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/pmIcon/${pid}.png`}
                  alt='Party icon'
                  className='w-6 h-6 object-contain [image-rendering:pixelated]'
                />
              </div>
            ))}
          </div>
        ) : (
          <div className='w-7 h-7 rounded-lg bg-emerald-50 border-2 border-[#34925e] flex items-center justify-center shrink-0'>
            <Sparkles className='w-4 h-4 text-[#34925e]' />
          </div>
        )}

        {/* Status text */}
        <div className='flex flex-col text-left'>
          <div className='flex items-center gap-1.5'>
            <span className='font-press-start text-[10px] tracking-wide text-[#34925e]'>
              TEAM
            </span>
            <span className='text-xs font-mono font-bold text-slate-700'>{party.length}/6</span>
          </div>
          {locationName && (
            <div className='flex items-center gap-1 text-[11px] font-bold text-slate-500 truncate max-w-[120px]'>
              <MapPin className='w-3 h-3 text-[#e05038] shrink-0' />
              <span className='truncate'>{locationName}</span>
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
