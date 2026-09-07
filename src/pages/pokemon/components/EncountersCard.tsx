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
import type { PokemonLocationEncounter } from '@/types/location';
import type { DetailedPokemon } from '@/types/pokemon';
import { Compass, Flame, Leaf, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EncountersCardProps {
  pokemon: DetailedPokemon;
}

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

export default function EncountersCard({ pokemon }: EncountersCardProps) {
  const { displayLanguage } = useLanguage();
  const encounters: PokemonLocationEncounter[] = pokemon.encounters || [];

  // Determine if exclusive
  const allVersions = new Set(encounters.map((e) => e.version));
  const isFireRedOnly = allVersions.size === 1 && allVersions.has('firered');
  const isLeafGreenOnly = allVersions.size === 1 && allVersions.has('leafgreen');

  return (
    <Card className='col-span-1 md:col-span-2 border-[3px] border-[#34925e] rounded-[10px] bg-white shadow-none'>
      <CardHeader className='flex flex-row items-center justify-between flex-wrap gap-2 pb-2'>
        <CardTitle className='font-press-start text-lg uppercase tracking-wider text-slate-800 relative pl-4 before:content-[""] before:absolute before:left-0 before:top-[15%] before:h-[70%] before:w-1 before:bg-[#e05038] flex items-center gap-2'>
          <span>Encounter Locations</span>
          <span className='text-xs font-mono font-normal text-muted-foreground'>
            ({encounters.length})
          </span>
        </CardTitle>

        {isFireRedOnly && (
          <span className='px-2.5 py-1 rounded-full bg-red-500 text-white font-mono text-xs font-semibold flex items-center gap-1 shadow-xs'>
            <Flame className='w-3.5 h-3.5' />
            火紅版限定 (FireRed Exclusive)
          </span>
        )}
        {isLeafGreenOnly && (
          <span className='px-2.5 py-1 rounded-full bg-emerald-600 text-white font-mono text-xs font-semibold flex items-center gap-1 shadow-xs'>
            <Leaf className='w-3.5 h-3.5' />
            葉綠版限定 (LeafGreen Exclusive)
          </span>
        )}
      </CardHeader>

      <CardContent className='pt-2'>
        {encounters.length === 0 ? (
          <div className='py-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2'>
            <Compass className='w-8 h-8 text-slate-300' />
            <p className='text-sm'>
              此寶可夢在《火紅／葉綠》中無野生出沒資料（可能為御三家進化、化石復活、交換或活動取得）
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto rounded-lg border border-slate-200'>
            <Table className='table-fixed w-full text-sm'>
              <TableHeader className='bg-slate-50'>
                <TableRow>
                  <TableHead className='w-[160px] md:w-[220px] font-semibold text-slate-700'>
                    地點 (Location)
                  </TableHead>
                  <TableHead className='w-[100px] md:w-[130px] font-semibold text-slate-700'>
                    區域 (Area)
                  </TableHead>
                  <TableHead className='w-[130px] font-semibold text-slate-700 text-center'>
                    方式 (Method)
                  </TableHead>
                  <TableHead className='w-[90px] font-semibold text-slate-700 text-center'>
                    等級 (Lv.)
                  </TableHead>
                  <TableHead className='w-[80px] font-semibold text-slate-700 text-center'>
                    機率 (Rate)
                  </TableHead>
                  <TableHead className='w-[90px] font-semibold text-slate-700 text-center'>
                    版本 (Ver.)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {encounters.map((enc, idx) => {
                  const locName = enc.locationName.zh;
                  const locSubName =
                    displayLanguage === 'en' ? enc.locationName.en : enc.locationName.ja;
                  const areaName =
                    displayLanguage === 'en'
                      ? enc.areaName?.en || 'Area'
                      : enc.areaName?.zh || '全域';
                  const methodName =
                    displayLanguage === 'en'
                      ? enc.methodName?.en || METHOD_NAMES[enc.method]?.en || enc.method
                      : enc.methodName?.zh || METHOD_NAMES[enc.method]?.zh || enc.method;
                  const icon = METHOD_ICONS[enc.method] || '📍';

                  return (
                    <TableRow key={`${enc.locationId}-${enc.method}-${idx}`} className='hover:bg-slate-50'>
                      <TableCell className='font-medium text-slate-900'>
                        <Link
                          to={`/locations?search=${encodeURIComponent(enc.locationName.zh)}`}
                          className='inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 hover:underline font-sans'
                        >
                          <MapPin className='w-3.5 h-3.5 text-emerald-600 shrink-0' />
                          <span>{locName}</span>
                          {locSubName && (
                            <span className='text-xs text-slate-400 font-sans hidden sm:inline'>
                              ({locSubName})
                            </span>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className='text-slate-600 font-sans text-xs text-center'>
                        {areaName}
                      </TableCell>
                      <TableCell className='text-slate-700 font-sans text-xs text-center'>
                        <div className='flex flex-col items-center justify-center gap-1'>
                          <div className='flex items-center justify-center gap-1'>
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
                      <TableCell className='text-center font-mono text-xs text-slate-700'>
                        {enc.minLevel === enc.maxLevel
                          ? `Lv.${enc.minLevel}`
                          : `Lv.${enc.minLevel}~${enc.maxLevel}`}
                      </TableCell>
                      <TableCell className='text-center font-mono text-xs font-semibold text-emerald-700'>
                        {enc.chance}%
                      </TableCell>
                      <TableCell className='text-center'>
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
        )}
      </CardContent>
    </Card>
  );
}
