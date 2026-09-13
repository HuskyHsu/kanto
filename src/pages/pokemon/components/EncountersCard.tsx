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
import type { PokemonLocationEncounter } from '@/types/location';
import type { DetailedPokemon } from '@/types/pokemon';
import {
  BASE_METHOD_NAMES,
  ITEM_METHOD_INFO,
  METHOD_ICONS,
} from '@/utils/encounterUtils';
import { Compass, Flame, Leaf, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

interface EncountersCardProps {
  pokemon: DetailedPokemon;
}

export default function EncountersCard({ pokemon }: EncountersCardProps) {
  const { displayLanguage } = useLanguage();
  const encounters: PokemonLocationEncounter[] = pokemon.encounters || [];
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  // Determine if exclusive
  const allVersions = new Set(encounters.map((e) => e.version));
  const isFireRedOnly = allVersions.size === 1 && allVersions.has('firered');
  const isLeafGreenOnly = allVersions.size === 1 && allVersions.has('leafgreen');

  // Filter encounters by selected version
  const filteredEncounters = useMemo(() => {
    return encounters.filter((enc) => {
      if (!selectedVersion) return true;
      if (selectedVersion === 'firered') {
        return enc.version === 'firered' || enc.version === 'both';
      }
      if (selectedVersion === 'leafgreen') {
        return enc.version === 'leafgreen' || enc.version === 'both';
      }
      return true;
    });
  }, [encounters, selectedVersion]);

  return (
    <Card className='col-span-1 md:col-span-2 border-[3px] border-[#34925e] rounded-[10px] bg-white shadow-none'>
      <CardHeader className='flex flex-row items-center justify-between flex-wrap gap-2.5 pb-3'>
        <div className='flex items-center gap-2 flex-wrap'>
          <CardTitle className='font-press-start text-base sm:text-lg uppercase tracking-wider text-slate-800 relative pl-4 before:content-[""] before:absolute before:left-0 before:top-[15%] before:h-[70%] before:w-1 before:bg-[#e05038] flex items-center gap-2'>
            <span>Encounter Locations</span>
            <span className='text-xs font-mono font-normal text-muted-foreground'>
              ({filteredEncounters.length})
            </span>
          </CardTitle>

          {isFireRedOnly && (
            <span className='px-2.5 py-0.5 rounded-full bg-red-500 text-white font-mono text-[11px] font-semibold flex items-center gap-1 shadow-2xs'>
              <Flame className='w-3 h-3' />
              火紅版限定
            </span>
          )}
          {isLeafGreenOnly && (
            <span className='px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[11px] font-semibold flex items-center gap-1 shadow-2xs'>
              <Leaf className='w-3 h-3' />
              葉綠版限定
            </span>
          )}
        </div>

        {/* Quick Version Filter */}
        {encounters.length > 0 && (
          <div className='flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium'>
            <button
              type='button'
              onClick={() => setSelectedVersion(null)}
              className={cn(
                'px-2.5 py-1 rounded-md transition-all cursor-pointer select-none',
                selectedVersion === null
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              全部版本
            </button>
            <button
              type='button'
              onClick={() => setSelectedVersion('firered')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer select-none',
                selectedVersion === 'firered'
                  ? 'bg-red-500 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-red-700',
              )}
            >
              <Flame className='w-3 h-3' />
              火紅
            </button>
            <button
              type='button'
              onClick={() => setSelectedVersion('leafgreen')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer select-none',
                selectedVersion === 'leafgreen'
                  ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-800',
              )}
            >
              <Leaf className='w-3 h-3' />
              葉綠
            </button>
          </div>
        )}
      </CardHeader>

      <CardContent className='pt-1 px-2 sm:px-6'>
        {encounters.length === 0 ? (
          <div className='py-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2'>
            <Compass className='w-8 h-8 text-slate-300' />
            <p className='text-sm'>
              此寶可夢在《火紅／葉綠》中無野生出沒資料（可能需捕捉進化前形態進化、初始御三家、化石復活、NPC交換或特殊活動取得）
            </p>
          </div>
        ) : filteredEncounters.length === 0 ? (
          <div className='py-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2'>
            <Compass className='w-8 h-8 text-slate-300' />
            <p className='text-sm'>在此版本條件下無可遭遇地點</p>
          </div>
        ) : (
          <div className='overflow-hidden rounded-xl border border-slate-200 shadow-2xs bg-white'>
            <Table className='table-fixed w-full'>
              <TableHeader className='bg-slate-100/90 text-slate-700'>
                <TableRow className='hover:bg-transparent border-b border-slate-200'>
                  <TableHead className='w-auto min-w-[110px] px-2.5 py-2.5 text-left font-bold text-xs sm:text-sm text-slate-800'>
                    地點 / 區域
                  </TableHead>
                  <TableHead className='w-[84px] min-w-[84px] px-1.5 py-2.5 text-left font-bold text-xs sm:text-sm text-slate-800'>
                    方式
                  </TableHead>
                  <TableHead className='w-[64px] min-w-[64px] px-1 py-2.5 text-center font-bold text-xs sm:text-sm text-slate-800'>
                    等級
                  </TableHead>
                  <TableHead className='w-[48px] min-w-[48px] px-1 py-2.5 text-center font-bold text-xs sm:text-sm text-slate-800'>
                    機率
                  </TableHead>
                  <TableHead className='w-[54px] min-w-[54px] px-1 py-2.5 text-center font-bold text-xs sm:text-sm text-slate-800'>
                    版本
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEncounters.map((enc, idx) => {
                  const locName = enc.locationName.zh;
                  const locSubName =
                    displayLanguage === 'en' ? enc.locationName.en : enc.locationName.ja;
                  const rawArea =
                    displayLanguage === 'en'
                      ? enc.areaName?.en || ''
                      : enc.areaName?.zh || '';
                  const hasArea =
                    rawArea && rawArea !== '全域' && rawArea !== 'Area';

                  // Method name and sub-name
                  const icon = METHOD_ICONS[enc.method] || '📍';
                  const baseMethod =
                    enc.methodName?.zh || BASE_METHOD_NAMES[enc.method] || enc.method;
                  const itemInfo = ITEM_METHOD_INFO[enc.method];
                  const subMethodName = itemInfo
                    ? displayLanguage === 'en'
                      ? itemInfo.en
                      : itemInfo.ja
                    : null;

                  return (
                    <TableRow
                      key={`${enc.locationId}-${enc.method}-${idx}`}
                      className='border-b border-slate-100 hover:bg-emerald-50/40 transition-colors odd:bg-white even:bg-slate-50/60'
                    >
                      {/* 地點與區域 */}
                      <TableCell className='py-2 px-2.5 text-left whitespace-normal break-words align-middle'>
                        <Link
                          to={`/locations?search=${encodeURIComponent(enc.locationName.zh)}`}
                          className='font-bold text-slate-900 text-xs sm:text-sm hover:text-emerald-700 hover:underline inline-flex items-center gap-1 leading-snug'
                          title={`前往 ${locName} 地點總覽`}
                        >
                          <MapPin className='w-3 h-3 text-[#34925e] shrink-0' />
                          <span>{locName}</span>
                        </Link>
                        <div className='flex items-center gap-1 text-[11px] text-slate-500 font-sans leading-tight mt-0.5 flex-wrap'>
                          {hasArea && (
                            <span className='font-semibold text-slate-700'>
                              {rawArea}
                            </span>
                          )}
                          {locSubName && (
                            <span
                              className={cn(
                                'text-slate-400',
                                displayLanguage === 'ja' ? 'font-pixel-jp' : '',
                              )}
                            >
                              {hasArea ? `(${locSubName})` : locSubName}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* 方式 */}
                      <TableCell className='py-2 px-1.5 text-left whitespace-normal break-words align-middle'>
                        <div className='flex items-center gap-1 text-xs font-semibold text-slate-800 leading-tight'>
                          <span className='shrink-0'>{icon}</span>
                          <span className='truncate'>{baseMethod}</span>
                        </div>
                        {subMethodName && (
                          <div
                            className={cn(
                              'text-[10px] text-slate-400 leading-tight mt-0.5 truncate',
                              displayLanguage === 'ja' ? 'font-pixel-jp' : 'font-sans',
                            )}
                          >
                            {subMethodName}
                          </div>
                        )}
                        {enc.tradeFor && (
                          <Link
                            to={`/pokemon/${enc.tradeFor.pid}`}
                            className='inline-flex items-center gap-0.5 text-[10px] text-amber-800 bg-amber-50 hover:bg-amber-100 px-1 py-0.5 rounded border border-amber-200 mt-1'
                            title={`需提供: ${enc.tradeFor.name.zh}`}
                          >
                            <span className='text-amber-600 font-medium'>需:</span>
                            <img
                              src={`${import.meta.env.BASE_URL}images/pmIcon/${enc.tradeFor.pid}.png`}
                              alt={enc.tradeFor.name.zh}
                              className='w-3.5 h-3.5 object-contain shrink-0 [image-rendering:pixelated]'
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `${import.meta.env.BASE_URL}images/pmIcon8Bit/${enc.tradeFor!.pid}.png`;
                              }}
                            />
                            <span className='truncate max-w-[50px] font-medium'>
                              {displayLanguage === 'en'
                                ? enc.tradeFor.name.en
                                : enc.tradeFor.name.zh}
                            </span>
                          </Link>
                        )}
                      </TableCell>

                      {/* 等級 */}
                      <TableCell className='py-2 px-1 text-center font-mono text-xs font-medium text-slate-700 whitespace-nowrap align-middle'>
                        {enc.minLevel === enc.maxLevel
                          ? `Lv.${enc.minLevel}`
                          : `Lv.${enc.minLevel}~${enc.maxLevel}`}
                      </TableCell>

                      {/* 機率 */}
                      <TableCell className='py-2 px-1 text-center font-mono text-xs font-bold text-emerald-700 whitespace-nowrap align-middle'>
                        {enc.chance}%
                      </TableCell>

                      {/* 版本 */}
                      <TableCell className='py-2 px-1 text-center whitespace-nowrap align-middle'>
                        {enc.version === 'both' && (
                          <span className='inline-block px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 text-slate-600 border border-slate-200'>
                            雙版本
                          </span>
                        )}
                        {enc.version === 'firered' && (
                          <span className='inline-block px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-500 text-white shadow-2xs'>
                            火紅
                          </span>
                        )}
                        {enc.version === 'leafgreen' && (
                          <span className='inline-block px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-600 text-white shadow-2xs'>
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
        )}
      </CardContent>
    </Card>
  );
}
