import PokemonTypes from '@/components/pokemon/Types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

const METHOD_ICONS: Record<string, string> = {
  walk: '🌿',
  surf: '🌊',
  'old-rod': '🎣',
  'good-rod': '🎣',
  'super-rod': '🎣',
  'rock-smash': '🪨',
  gift: '🎁',
  'gift-egg': '🥚',
  static: '❗',
  'only-one': '❗',
  pokeflute: '🎶',
  'npc-trade': '🔄',
  trade: '🔄',
  'roaming-grass': '🏃',
  'colosseum-bonus-disc-jpn': '🎉',
};

const METHOD_NAMES: Record<string, { zh: string; en: string }> = {
  walk: { zh: '草叢/走路', en: 'Walk' },
  surf: { zh: '衝浪', en: 'Surf' },
  'old-rod': { zh: '破舊釣竿', en: 'Old Rod' },
  'good-rod': { zh: '好釣竿', en: 'Good Rod' },
  'super-rod': { zh: '厲害釣竿', en: 'Super Rod' },
  'rock-smash': { zh: '碎岩', en: 'Rock Smash' },
  gift: { zh: '贈送/領取', en: 'Gift' },
  'gift-egg': { zh: '贈送蛋', en: 'Gift Egg' },
  static: { zh: '定點遭遇', en: 'Stationary' },
  'only-one': { zh: '定點遭遇', en: 'Stationary' },
  pokeflute: { zh: '寶可夢之笛', en: 'Poké Flute' },
  'npc-trade': { zh: 'NPC交換', en: 'In-game Trade' },
  trade: { zh: 'NPC交換', en: 'In-game Trade' },
  'roaming-grass': { zh: '全境遊走', en: 'Roaming' },
  'colosseum-bonus-disc-jpn': { zh: '特殊活動/連動', en: 'Special Event' },
};

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
      <CardHeader className='flex flex-row items-center justify-between flex-wrap gap-2'>
        <CardTitle>Locations List ({locations.length} locations)</CardTitle>
        <button
          type='button'
          onClick={toggleAll}
          className='text-xs text-slate-500 hover:text-slate-800 underline font-sans cursor-pointer'
        >
          {isAllExpanded ? '收合全部 (Collapse All)' : '展開全部 (Expand All)'}
        </button>
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
                <div className='border-t border-slate-100 p-3 space-y-3 bg-slate-50/40'>
                  {filteredAreas.map((area, aIdx) => {
                    const areaDisplayName =
                      displayLanguage === 'en' ? area.name.en || 'Area' : area.name.zh || '全域';

                    return (
                      <div key={`${location.id}-area-${aIdx}`} className='space-y-1.5'>
                        {filteredAreas.length > 1 && (
                          <div className='flex items-center gap-2 px-1'>
                            <div className='w-1.5 h-1.5 rounded-full bg-[#34925e]' />
                            <span className='text-xs font-semibold text-slate-700 uppercase tracking-wider'>
                              {areaDisplayName}
                            </span>
                            <span className='text-[10px] font-mono text-muted-foreground'>
                              ({area.encounters.length})
                            </span>
                          </div>
                        )}

                        <div className='overflow-x-auto rounded-lg border border-slate-200 bg-white'>
                          <Table className='table-fixed w-full text-sm'>
                            <TableHeader className='bg-slate-50'>
                              <TableRow>
                                <TableHead className='px-2 w-[160px] md:w-[220px] font-semibold text-slate-700 text-center'>
                                  Name
                                </TableHead>
                                <TableHead className='px-1 w-[70px] font-semibold text-slate-700 text-center'>
                                  Type
                                </TableHead>
                                <TableHead className='px-1 w-[120px] md:w-[140px] font-semibold text-slate-700 text-center'>
                                  Method
                                </TableHead>
                                <TableHead className='px-1 w-[80px] font-semibold text-slate-700 text-center'>
                                  Level
                                </TableHead>
                                <TableHead className='px-1 w-[60px] font-semibold text-slate-700 text-center'>
                                  Rate
                                </TableHead>
                                <TableHead className='px-1 w-[80px] font-semibold text-slate-700 text-center'>
                                  Ver.
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {area.encounters.map((enc, eIdx) => {
                                const pmName = enc.name.zh;
                                const pmSubName =
                                  displayLanguage === 'en' ? enc.name.en : enc.name.ja;
                                const methodName =
                                  displayLanguage === 'en'
                                    ? enc.methodName?.en || METHOD_NAMES[enc.method]?.en || enc.method
                                    : enc.methodName?.zh || METHOD_NAMES[enc.method]?.zh || enc.method;
                                const icon = METHOD_ICONS[enc.method] || '📍';

                                return (
                                  <TableRow
                                    key={`${enc.pid}-${enc.method}-${eIdx}`}
                                    className='hover:bg-slate-50 transition-colors'
                                  >
                                    {/* Centered Pokemon Name & Icon */}
                                    <TableCell className='px-2 py-2 text-center'>
                                      <div className='flex items-center justify-center'>
                                        <Link
                                          to={`/pokemon/${enc.pid}`}
                                          className='inline-flex items-center gap-2 text-slate-900 hover:text-emerald-700 font-sans group'
                                        >
                                          <div className='w-7 h-7 relative shrink-0 flex items-center justify-center'>
                                            <img
                                              src={`${import.meta.env.BASE_URL}images/pmIcon/${enc.pid}.png`}
                                              alt={pmName}
                                              className='w-6 h-6 object-contain group-hover:scale-110 transition-transform'
                                              onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `${import.meta.env.BASE_URL}images/pmIcon8Bit/${enc.pid}.png`;
                                              }}
                                            />
                                          </div>
                                          <div className='flex flex-col text-left'>
                                            <span className='font-semibold text-xs leading-tight group-hover:underline'>
                                              {pmName}
                                            </span>
                                            <span className='font-mono text-[10px] text-slate-400'>
                                              #{enc.pid.toString().padStart(3, '0')}
                                              {pmSubName ? ` (${pmSubName})` : ''}
                                            </span>
                                          </div>
                                        </Link>
                                      </div>
                                    </TableCell>

                                    {/* Centered Types */}
                                    <TableCell className='px-1 text-center py-2'>
                                      <PokemonTypes types={enc.types} className='w-4 h-4' />
                                    </TableCell>

                                    {/* Centered Method */}
                                    <TableCell className='px-1 text-xs text-slate-700 py-2 text-center'>
                                      <div className='flex flex-col items-center justify-center gap-1'>
                                        <div className='flex items-center justify-center gap-1.5'>
                                          <span>{icon}</span>
                                          <span>{methodName}</span>
                                        </div>
                                        {enc.tradeFor && (
                                          <Link
                                            to={`/pokemon/${enc.tradeFor.pid}`}
                                            className='inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 hover:text-amber-950 px-1.5 py-0.5 rounded border border-amber-200 transition-colors shadow-2xs group'
                                            title={`需提供: ${enc.tradeFor.name.zh} (${enc.tradeFor.name.en})`}
                                          >
                                            <span className='text-amber-600 font-sans text-[10px]'>
                                              {displayLanguage === 'en' ? 'w/' : '需:'}
                                            </span>
                                            <img
                                              src={`${import.meta.env.BASE_URL}images/pmIcon/${enc.tradeFor.pid}.png`}
                                              alt={enc.tradeFor.name.zh}
                                              className='w-4 h-4 object-contain group-hover:scale-110 transition-transform'
                                              onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `${import.meta.env.BASE_URL}images/pmIcon8Bit/${enc.tradeFor!.pid}.png`;
                                              }}
                                            />
                                            <span className='underline underline-offset-2'>
                                              {displayLanguage === 'en' ? enc.tradeFor.name.en : enc.tradeFor.name.zh}
                                            </span>
                                          </Link>
                                        )}
                                      </div>
                                    </TableCell>

                                    {/* Centered Level */}
                                    <TableCell className='px-1 text-center font-mono text-xs text-slate-700 py-2'>
                                      {enc.minLevel === enc.maxLevel
                                        ? `Lv.${enc.minLevel}`
                                        : `Lv.${enc.minLevel}~${enc.maxLevel}`}
                                    </TableCell>

                                    {/* Centered Rate */}
                                    <TableCell className='px-1 text-center font-mono text-xs font-semibold text-emerald-700 py-2'>
                                      {enc.chance}%
                                    </TableCell>

                                    {/* Centered Version */}
                                    <TableCell className='px-1 text-center py-2'>
                                      {enc.version === 'both' && (
                                        <span className='inline-block px-1.5 py-0.5 text-[10px] font-sans font-medium rounded bg-slate-100 text-slate-700 border border-slate-200'>
                                          雙版本
                                        </span>
                                      )}
                                      {enc.version === 'firered' && (
                                        <span className='inline-block px-1.5 py-0.5 text-[10px] font-sans font-medium rounded bg-red-100 text-red-700 border border-red-200'>
                                          火紅
                                        </span>
                                      )}
                                      {enc.version === 'leafgreen' && (
                                        <span className='inline-block px-1.5 py-0.5 text-[10px] font-sans font-medium rounded bg-emerald-100 text-emerald-700 border border-emerald-200'>
                                          葉綠
                                        </span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
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
