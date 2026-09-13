import PokemonTypes from '@/components/pokemon/Types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { GameLocation } from '@/types/location';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface LocationListCardProps {
  locations: GameLocation[];
  versionFilter?: string | null;
}

const CATEGORY_LABELS: Record<string, { label: string; bg: string }> = {
  route: { label: '道路/水路', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  dungeon: { label: '洞窟/迷宮', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  city: { label: '城鎮/水域', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  special: { label: '特殊地點', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const SUB_REGION_LABELS: Record<string, string> = {
  kanto: '關都',
  'one-island': '一之島',
  'two-island': '二之島',
  'three-island': '三之島',
  'four-island': '四之島',
  'five-island': '五之島',
  'six-island': '六之島',
  'seven-island': '七之島',
  special: '特殊',
};

import { groupEncountersByMethod } from '@/utils/encounterUtils';

export default function LocationListCard({ locations, versionFilter }: LocationListCardProps) {
  const { displayLanguage } = useLanguage();
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const toggleExpand = (locId: string) => {
    setExpandedMap((prev) => ({
      ...prev,
      [locId]: !prev[locId],
    }));
  };

  const isAllExpanded = locations.length > 0 && locations.every((l) => expandedMap[l.id]);

  const toggleAll = () => {
    if (isAllExpanded) {
      setExpandedMap({});
    } else {
      const all: Record<string, boolean> = {};
      locations.forEach((l) => {
        all[l.id] = true;
      });
      setExpandedMap(all);
    }
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between flex-wrap gap-3 pb-4'>
        <CardTitle>Locations List ({locations.length} locations)</CardTitle>
        <div>
          <button
            type='button'
            onClick={toggleAll}
            className='text-xs text-slate-500 hover:text-slate-800 underline font-sans cursor-pointer'
          >
            {isAllExpanded ? '收合全部 (Collapse All)' : '展開全部 (Expand All)'}
          </button>
        </div>
      </CardHeader>
      <CardContent className='px-0 md:px-6 space-y-4'>
        {locations.map((location) => {
          const locName = location.name.zh;
          const locSubName = displayLanguage === 'en' ? location.name.en : location.name.ja;
          const isExpanded = expandedMap[location.id] ?? false;

          const catMeta = CATEGORY_LABELS[location.category] || {
            label: location.category,
            bg: 'bg-slate-100 text-slate-700 border-slate-200',
          };
          const subRegionText = SUB_REGION_LABELS[location.subRegion] || location.region;

          // Filter encounters by version if versionFilter active
          const filteredAreas = location.areas
            .map((area) => ({
              ...area,
              encounters: area.encounters.filter((enc) => {
                if (!versionFilter) return true;
                if (versionFilter === 'firered') {
                  return enc.version === 'firered' || enc.version === 'both';
                }
                if (versionFilter === 'leafgreen') {
                  return enc.version === 'leafgreen' || enc.version === 'both';
                }
                return true;
              }),
            }))
            .filter((area) => area.encounters.length > 0);

          const totalEncounters = filteredAreas.reduce((acc, a) => acc + a.encounters.length, 0);

          return (
            <div
              key={location.id}
              className='border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs'
            >
              {/* Header */}
              <div
                onClick={() => toggleExpand(location.id)}
                className='p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors gap-3 select-none'
              >
                <div className='flex items-center gap-2.5 flex-wrap'>
                  <MapPin className='w-4 h-4 text-[#34925e] shrink-0' />
                  <span className='font-bold text-slate-900 text-sm md:text-base'>{locName}</span>
                  {locSubName && (
                    <span className='text-xs text-slate-400 font-sans hidden sm:inline'>
                      ({locSubName})
                    </span>
                  )}
                  <div className='flex items-center gap-1.5 ml-1'>
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded font-sans border font-medium',
                        catMeta.bg,
                      )}
                    >
                      {catMeta.label}
                    </span>
                    <span className='text-[10px] px-1.5 py-0.5 rounded font-sans bg-slate-50 text-slate-600 border border-slate-200 font-medium'>
                      {subRegionText}
                    </span>
                    <span className='text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60'>
                      {totalEncounters} 遭遇
                    </span>
                  </div>
                </div>

                <div className='text-slate-400 hover:text-slate-700'>
                  {isExpanded ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
                </div>
              </div>

              {/* Collapsible Area Tables */}
              {isExpanded && (
                <div className='border-t border-slate-100 p-3 sm:p-4 space-y-5 bg-white'>
                  {filteredAreas.map((area, aIdx) => {
                    const areaNameZh = area.name.zh || '全域';
                    const areaSubName = displayLanguage === 'en' ? area.name.en : area.name.ja;
                    const methodGroups = groupEncountersByMethod(area.encounters, displayLanguage);

                    return (
                      <div key={`${location.id}-area-${aIdx}`} className='space-y-3.5'>
                        {filteredAreas.length > 1 && (
                          <div className='flex items-center gap-2 px-1 pt-1 pb-0.5 border-b border-slate-100'>
                            <div className='w-2 h-2 rounded-full bg-[#34925e]' />
                            <span className='text-xs sm:text-sm font-bold text-slate-800 tracking-wide'>
                              {areaNameZh}
                              {areaSubName && areaNameZh !== '全域' && areaSubName !== areaNameZh && (
                                <span className='ml-1.5 font-normal text-slate-400 text-xs font-sans'>
                                  ({areaSubName})
                                </span>
                              )}
                            </span>
                            <span className='text-[10px] font-mono text-muted-foreground'>
                              ({area.encounters.length})
                            </span>
                          </div>
                        )}

                        <div className='space-y-4'>
                          {methodGroups.map((group) => (
                            <div
                              key={`${location.id}-area-${aIdx}-${group.method}`}
                              className='space-y-2'
                            >
                              {/* Method Group Header badge */}
                              <div className='flex items-center gap-2 px-1'>
                                <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100/90 border border-slate-200/70 text-xs font-semibold text-slate-700 font-sans shadow-2xs'>
                                  <span>{group.icon}</span>
                                  <span>{group.displayName}</span>
                                  <span className='text-[10px] font-mono font-normal text-slate-500'>
                                    ({group.encounters.length})
                                  </span>
                                </div>
                              </div>

                              {/* Card Grid for this method */}
                              <div className='grid grid-cols-2 min-[540px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5'>
                                {group.encounters.map((enc, eIdx) => {
                                  const pmName = enc.name.zh;
                                  const pmSubName =
                                    displayLanguage === 'en' ? enc.name.en : enc.name.ja;

                                  return (
                                    <div
                                      key={`${enc.pid}-${enc.method}-${eIdx}`}
                                      className='group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-2.5 hover:border-emerald-400 hover:shadow-sm transition-all duration-200'
                                    >
                                      {/* Upper Area: Sprite & Corner Metadata */}
                                      <div className='relative w-full h-21 sm:h-23 flex items-center justify-center'>
                                        {/* Top-Left: Dex # */}
                                        <span className='absolute top-0 left-0 font-mono text-[10px] font-semibold text-slate-400 tracking-tight'>
                                          #{enc.pid.toString().padStart(3, '0')}
                                        </span>

                                        {/* Top-Right: Version Badge (Only displayed when there is a version exclusive) */}
                                        {enc.version === 'firered' && (
                                          <span className='absolute top-0 right-0 inline-flex items-center h-[18px] px-1.5 text-[9px] font-sans font-medium rounded bg-red-500 text-white shadow-2xs leading-none'>
                                            火紅
                                          </span>
                                        )}
                                        {enc.version === 'leafgreen' && (
                                          <span className='absolute top-0 right-0 inline-flex items-center h-[18px] px-1.5 text-[9px] font-sans font-medium rounded bg-emerald-600 text-white shadow-2xs leading-none'>
                                            葉綠
                                          </span>
                                        )}

                                        {/* Centered Large Sprite */}
                                        <Link
                                          to={`/pokemon/${enc.pid}`}
                                          className='flex items-center justify-center p-1'
                                        >
                                          <img
                                            src={`${import.meta.env.BASE_URL}images/pmIcon/${enc.pid}.png`}
                                            alt={pmName}
                                            className='w-15 h-15 sm:w-16 sm:h-16 object-contain [image-rendering:pixelated] group-hover:scale-115 transition-transform duration-200'
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement;
                                              target.src = `${import.meta.env.BASE_URL}images/pmIcon8Bit/${enc.pid}.png`;
                                            }}
                                          />
                                        </Link>

                                        {/* Bottom-Left: Level Badge */}
                                        <span className='absolute bottom-0 left-0 inline-flex items-center h-[18px] font-mono text-[9px] sm:text-[10px] font-medium px-1.5 rounded bg-slate-100 text-slate-700 leading-none'>
                                          {enc.minLevel === enc.maxLevel
                                            ? `Lv.${enc.minLevel}`
                                            : `Lv.${enc.minLevel}~${enc.maxLevel}`}
                                        </span>

                                        {/* Bottom-Right: Rate Badge */}
                                        <span className='absolute bottom-0 right-0 inline-flex items-center h-[18px] font-mono text-[9px] sm:text-[10px] font-bold px-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/70 leading-none'>
                                          {enc.chance}%
                                        </span>
                                      </div>

                                      {/* Info Area Below Sprite with subtle divider */}
                                      <div className='mt-2 pt-1.5 border-t border-slate-100 flex flex-col gap-1'>
                                        {/* Name and Types in one line */}
                                        <div className='flex items-center justify-between gap-1'>
                                          <Link
                                            to={`/pokemon/${enc.pid}`}
                                            className='font-bold text-slate-800 text-xs sm:text-sm hover:text-emerald-700 hover:underline truncate'
                                            title={`${pmName} (${pmSubName})`}
                                          >
                                            {pmName}
                                          </Link>
                                          <div className='shrink-0'>
                                            <PokemonTypes types={enc.types} className='w-3.5 h-3.5' />
                                          </div>
                                        </div>

                                        {/* Trade Requirement Info (if NPC trade) */}
                                        {enc.tradeFor && (
                                          <div className='flex items-center justify-start text-[10px] text-slate-500 pt-0.5'>
                                            <Link
                                              to={`/pokemon/${enc.tradeFor.pid}`}
                                              className='inline-flex items-center gap-0.5 text-amber-700 hover:underline shrink-0 bg-amber-50 px-1 py-0.5 rounded border border-amber-200/60'
                                              title={`需提供: ${enc.tradeFor.name.zh} (${enc.tradeFor.name.en})`}
                                            >
                                              <span className='text-amber-600 text-[9px]'>
                                                {displayLanguage === 'en' ? 'w/' : '需:'}
                                              </span>
                                              <img
                                                src={`${import.meta.env.BASE_URL}images/pmIcon/${enc.tradeFor.pid}.png`}
                                                alt={enc.tradeFor.name.zh}
                                                className='w-3 h-3 object-contain shrink-0'
                                                onError={(e) => {
                                                  const target = e.target as HTMLImageElement;
                                                  target.src = `${import.meta.env.BASE_URL}images/pmIcon8Bit/${enc.tradeFor!.pid}.png`;
                                                }}
                                              />
                                              <span className='truncate max-w-[55px] text-[9px] font-medium'>
                                                {displayLanguage === 'en' ? enc.tradeFor.name.en : enc.tradeFor.name.zh}
                                              </span>
                                            </Link>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
