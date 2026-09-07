import PokemonTypes from '@/components/pokemon/Types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

interface LocationCardProps {
  location: GameLocation;
  defaultExpanded?: boolean;
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
  'only-one': '❗',
  pokeflute: '🎶',
  trade: '🔄',
};

export default function LocationCard({
  location,
  defaultExpanded = true,
  versionFilter,
}: LocationCardProps) {
  const { displayLanguage } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const locName = location.name.zh;
  const locSubName =
    displayLanguage === 'en' ? location.name.en : location.name.ja;

  const catMeta = CATEGORY_LABELS[location.category] || {
    label: location.category,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const subRegionText = SUB_REGION_LABELS[location.subRegion] || location.region;

  // Filter encounters by version if versionFilter is active
  const filteredAreas = location.areas
    .map((area) => {
      const matched = area.encounters.filter((enc) => {
        if (!versionFilter) return true;
        if (versionFilter === 'firered') {
          return enc.version === 'firered' || enc.version === 'both';
        }
        if (versionFilter === 'leafgreen') {
          return enc.version === 'leafgreen' || enc.version === 'both';
        }
        return true;
      });
      return {
        ...area,
        encounters: matched,
      };
    })
    .filter((area) => area.encounters.length > 0);

  const totalPokemonCount = filteredAreas.reduce(
    (acc, area) => acc + area.encounters.length,
    0,
  );

  if (filteredAreas.length === 0) {
    return null;
  }

  return (
    <Card
      id={`location-${location.id}`}
      className='border-[2px] border-slate-200/90 rounded-[10px] bg-white shadow-xs overflow-hidden transition-all'
    >
      <CardHeader
        onClick={() => setIsExpanded(!isExpanded)}
        className='p-3.5 md:p-4 cursor-pointer hover:bg-slate-50/80 transition-colors flex flex-row items-center justify-between gap-3'
      >
        <div className='flex items-center gap-2.5 flex-wrap'>
          <MapPin className='w-4 h-4 text-[#34925e] shrink-0' />
          <h3 className='font-bold text-slate-900 text-base md:text-lg tracking-tight'>
            {locName}
          </h3>
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
              {totalPokemonCount} 遭遇
            </span>
          </div>
        </div>

        <button
          type='button'
          className='text-slate-400 hover:text-slate-700 p-1'
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? (
            <ChevronUp className='w-5 h-5' />
          ) : (
            <ChevronDown className='w-5 h-5' />
          )}
        </button>
      </CardHeader>

      {isExpanded && (
        <CardContent className='p-3 md:p-4 pt-0 border-t border-slate-100 space-y-4'>
          {filteredAreas.map((area, aIdx) => {
            const areaDisplayName =
              displayLanguage === 'en'
                ? area.name.en || 'Area'
                : area.name.zh || '全域';

            return (
              <div key={`${location.id}-area-${aIdx}`} className='space-y-2 mt-3'>
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

                <div className='overflow-x-auto rounded-lg border border-slate-200/80'>
                  <Table className='table-fixed w-full text-sm'>
                    <TableHeader className='bg-slate-50/80'>
                      <TableRow>
                        <TableHead className='w-[160px] md:w-[220px] font-semibold text-slate-700'>
                          寶可夢 (Pokemon)
                        </TableHead>
                        <TableHead className='w-[80px] font-semibold text-slate-700 text-center'>
                          屬性
                        </TableHead>
                        <TableHead className='w-[120px] font-semibold text-slate-700'>
                          遭遇方式
                        </TableHead>
                        <TableHead className='w-[80px] font-semibold text-slate-700 text-center'>
                          等級
                        </TableHead>
                        <TableHead className='w-[70px] font-semibold text-slate-700 text-right'>
                          出現率
                        </TableHead>
                        <TableHead className='w-[80px] font-semibold text-slate-700 text-center'>
                          版本
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
                            ? enc.methodName?.en || enc.method
                            : enc.methodName?.zh || enc.method;
                        const icon = METHOD_ICONS[enc.method] || '📍';

                        return (
                          <TableRow
                            key={`${enc.pid}-${enc.method}-${eIdx}`}
                            className='hover:bg-slate-50/70 transition-colors'
                          >
                            {/* Pokemon Icon & Name */}
                            <TableCell className='py-2'>
                              <Link
                                to={`/pokemon/${enc.pid}`}
                                className='inline-flex items-center gap-2.5 text-slate-900 hover:text-emerald-700 font-sans group'
                              >
                                <div className='w-8 h-8 relative shrink-0 flex items-center justify-center'>
                                  <img
                                    src={`${import.meta.env.BASE_URL}images/pmIcon/${enc.pid}.png`}
                                    alt={pmName}
                                    className='w-7 h-7 object-contain group-hover:scale-110 transition-transform'
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = `${import.meta.env.BASE_URL}images/pmIcon8Bit/${enc.pid}.png`;
                                    }}
                                  />
                                </div>
                                <div className='flex flex-col'>
                                  <span className='font-semibold text-xs leading-tight group-hover:underline'>
                                    {pmName}
                                  </span>
                                  <span className='font-mono text-[10px] text-slate-400'>
                                    #{enc.pid.toString().padStart(3, '0')}
                                    {pmSubName ? ` (${pmSubName})` : ''}
                                  </span>
                                </div>
                              </Link>
                            </TableCell>

                            {/* Types */}
                            <TableCell className='text-center py-2'>
                              <PokemonTypes types={enc.types} className='w-4 h-4' />
                            </TableCell>

                            {/* Method */}
                            <TableCell className='text-xs text-slate-700 py-2'>
                              <span className='inline-flex items-center gap-1.5'>
                                <span>{icon}</span>
                                <span>{methodName}</span>
                              </span>
                            </TableCell>

                            {/* Level */}
                            <TableCell className='text-center font-mono text-xs text-slate-700 py-2'>
                              {enc.minLevel === enc.maxLevel
                                ? `Lv.${enc.minLevel}`
                                : `Lv.${enc.minLevel}~${enc.maxLevel}`}
                            </TableCell>

                            {/* Rate */}
                            <TableCell className='text-right font-mono text-xs font-semibold text-emerald-700 py-2'>
                              {enc.chance}%
                            </TableCell>

                            {/* Version Badge */}
                            <TableCell className='text-center py-2'>
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
        </CardContent>
      )}
    </Card>
  );
}
