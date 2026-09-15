import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanion } from '@/contexts/CompanionContext';
import { useLocationData } from '@/hooks/useLocationData';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LocationPokemonEncounter } from '@/types/location';
import { Compass, MapPin } from 'lucide-react';

export const RadarTab: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLocationId, setSelectedLocationId } = useCompanion();
  const { locationList, loading } = useLocationData();
  const { displayLanguage } = useLanguage();

  // Current selected location
  const currentLocation = useMemo(() => {
    if (!locationList.length) return null;
    if (selectedLocationId) {
      const found = locationList.find((loc) => loc.id === selectedLocationId);
      if (found) return found;
    }
    const route1 = locationList.find((loc) => loc.id === 'route-1');
    return route1 || locationList[0];
  }, [locationList, selectedLocationId]);

  // Unique encounters for clean icon display
  const uniqueEncounters = useMemo(() => {
    if (!currentLocation) return [];
    const map = new Map<number, LocationPokemonEncounter>();
    currentLocation.areas.forEach((area) => {
      area.encounters.forEach((enc) => {
        if (!map.has(enc.pid)) {
          map.set(enc.pid, enc);
        }
      });
    });
    return Array.from(map.values());
  }, [currentLocation]);

  return (
    <div className='p-2.5 space-y-3 text-slate-800'>
      {/* Location Selector */}
      <div className='space-y-1.5'>
        <label className='text-[10px] font-press-start text-slate-600 flex items-center gap-1'>
          <Compass className='w-3 h-3 text-[#34925e]' />
          <span>AREA</span>
        </label>
        <div className='relative'>
          <select
            value={currentLocation?.id || ''}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className='w-full px-2.5 py-1.5 text-xs font-bold bg-white border-2 border-slate-300 rounded-[8px] shadow-[2px_2px_0_0_rgba(203,213,225,1)] text-slate-800 focus:outline-none focus:border-[#34925e] cursor-pointer truncate'
          >
            {locationList.map((loc) => {
              const locName = loc.name.zh;
              const subName = loc.name[displayLanguage] || loc.name.en;
              return (
                <option key={loc.id} value={loc.id}>
                  {loc.region === 'sevii' ? '七島 ' : ''}{locName} ({subName})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Encounters Showcase - Retro Icon Grid */}
      {loading ? (
        <div className='text-center py-6 text-xs text-slate-400 font-press-start text-[10px]'>
          LOADING...
        </div>
      ) : !currentLocation || uniqueEncounters.length === 0 ? (
        <div className='text-center py-6 border-2 border-dashed border-slate-300 rounded-[8px] bg-white p-3 shadow-[1px_1px_0_0_rgba(203,213,225,1)]'>
          <MapPin className='w-5 h-5 text-slate-300 mx-auto mb-1' />
          <p className='text-[10px] font-press-start text-slate-400'>NO WILD PM</p>
        </div>
      ) : (
        <div className='space-y-1.5'>
          <div className='flex items-center justify-between px-0.5'>
            <span className='text-[10px] font-press-start text-slate-600'>
              WILD ({uniqueEncounters.length})
            </span>
          </div>

          <div className='grid grid-cols-3 gap-1.5'>
            {uniqueEncounters.map((enc) => (
              <div
                key={enc.pid}
                onClick={() => navigate(`/pokemon/${enc.pid}`)}
                className='group relative aspect-square rounded-[8px] bg-white border-2 border-slate-300 hover:border-[#34925e] flex flex-col items-center justify-center p-1 transition-all shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:shadow-[2px_3px_0_0_rgba(52,146,94,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer'
                title={`${enc.name.zh} #${enc.pid} (${enc.methodName?.zh || enc.method} ${enc.chance}%)`}
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/pmIcon/${enc.pid}.png`}
                  alt={enc.name.zh}
                  className='w-10 h-10 object-contain [image-rendering:pixelated] group-hover:scale-110 transition-transform'
                  loading='lazy'
                />
                <span className='absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-slate-400 group-hover:text-[#34925e]'>
                  {enc.chance}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
