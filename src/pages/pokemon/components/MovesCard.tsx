import { PokemonTypes } from '@/components/pokemon';
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
import type { DetailedPokemon } from '@/types/pokemon';
import { useState } from 'react';
import MoveRow from './MoveRow';

interface MovesCardProps {
  pokemon: DetailedPokemon;
}

const tutorLocations: Record<string, string> = {
  食夢: '第八道館左邊使用 HM01',
  捨身衝撞: '冠軍之路洞穴盡頭的人',
  百萬噸重拳: '見月山出口，左邊那人',
  百萬噸重踢: '見月山出口，右邊那人',
  岩崩: '黑暗山洞倒數第二層',
  生蛋: '遊樂中心左邊池塘使用 HM03',
  雙倍奉還: '大型百貨公司三樓',
  替身: '第五道館附近',
  電磁波: '銀色大廈（從3樓這裡跳上去跟一個女人學得）',
  揮指: '第七道館附近研究所內的第二房間',
  地球上投: '第一道館上方博物館，要使用 HM01',
  模仿: '第六道館模仿技女孩的家，必須持有皮皮玩偶（百貨公司四樓有賣）',
  大爆炸: '新島第一島上方洞穴跟胖子學得',
  劍舞: '新島第七島',
  泰山壓頂: '新島第四島的居民（內有兩個胖子）',
  爆炸烈焰: '新島第二島瀑布上方小屋（依最初寶可夢而定）',
  加農水炮: '新島第二島瀑布上方小屋（依最初寶可夢而定）',
  瘋狂植物: '新島第二島瀑布上方小屋（依最初寶可夢而定）',
};

export default function MovesCard({ pokemon }: MovesCardProps) {
  const { displayLanguage } = useLanguage();

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allMoves = [
    ...pokemon.levelUpMoves,
    ...pokemon.TMMoves,
    ...pokemon.HTMMoves,
    ...pokemon.eggMoves,
    ...pokemon.tutorMoves,
  ];

  const uniqueTypes = Array.from(new Set(allMoves.map((m) => m.type))).sort();
  const categories = ['Physical', 'Special', 'Status'];

  const filterMove = (
    move:
      | DetailedPokemon['levelUpMoves'][0]
      | DetailedPokemon['TMMoves'][0]
      | DetailedPokemon['HTMMoves'][0]
      | DetailedPokemon['eggMoves'][0]
      | DetailedPokemon['tutorMoves'][0],
  ) => {
    if (!move) return false;
    const typeMatch = selectedType === null || move.type === selectedType;
    const categoryMatch = selectedCategory === null || move.category === selectedCategory;
    return typeMatch && categoryMatch;
  };

  const toggleType = (type: string) => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <Card className='lg:col-span-2 border-[3px] border-[#34925e] rounded-[10px] bg-white shadow-none'>
      <CardHeader>
        <CardTitle className='font-press-start text-lg uppercase tracking-wider text-slate-800 relative pl-4 before:content-[""] before:absolute before:left-0 before:top-[15%] before:h-[70%] before:w-1 before:bg-[#e05038]'>
          Moves
        </CardTitle>
      </CardHeader>
      <CardContent className='px-0 md:px-6 font-mono tracking-tighter'>
        <div className='mb-6 -mt-4 space-y-4 px-6 md:px-0'>
          <p className='text-sm font-semibold'>Type:</p>
          <div className='flex flex-wrap gap-2 items-center'>
            {uniqueTypes.map((type) => {
              const isSelected = selectedType === type;
              const shouldFade = selectedType !== null && !isSelected;

              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={cn(
                    'flex items-center justify-center rounded-lg transition-all duration-100',
                    shouldFade ? 'opacity-30' : 'opacity-100',
                    'hover:scale-110 active:scale-90',
                  )}
                  title={type}
                >
                  <PokemonTypes types={[type]} className='w-8 h-8' />
                </button>
              );
            })}
          </div>
          <p className='text-sm font-semibold'>Category:</p>
          <div className='flex flex-wrap gap-2 items-center'>
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const shouldFade = selectedCategory !== null && !isSelected;

              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    'flex items-center justify-center rounded-lg transition-all duration-100',
                    'border-2 border-[#34925e] bg-white hover:border-[#2a754b]',
                    shouldFade ? 'opacity-30' : 'opacity-100',
                    'hover:scale-110 active:scale-90',
                  )}
                  title={category}
                >
                  <PokemonTypes types={[category]} className='w-8 h-8' />
                </button>
              );
            })}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 text-center mt-4'>
          <div className='bg-slate-50 p-2 sm:p-4 rounded-xl border-2 border-slate-200'>
            <h4 className='font-press-start text-sm mb-4 text-slate-700 bg-white inline-block px-4 py-2 border-2 border-[#34925e] rounded shadow-[2px_2px_0_0_#34925e]'>
              Level Up Moves
            </h4>
            <Table>
              <TableHeader>
                <TableRow className=''>
                  <TableHead className='w-2/12 min-w-[60px]'>Lv</TableHead>
                  <TableHead className='w-3/12'>Name</TableHead>
                  <TableHead className='w-2/12'>Type</TableHead>
                  <TableHead className='w-2/12'>Cat.</TableHead>
                  <TableHead className='w-1/12'>Att.</TableHead>
                  <TableHead className='w-1/12'>Acc.</TableHead>
                  <TableHead className='w-1/12'>PP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pokemon.levelUpMoves.filter(filterMove).map((move) => {
                  let from: React.ReactNode = '—';
                  if (move.level < 0) {
                    from = (
                      <div className='flex flex-col text-[10px] leading-tight text-slate-500 font-bold font-sans'>
                        <span>{move.preEvoName?.zh}</span>
                        <span>Lv.{Math.abs(move.level)}</span>
                      </div>
                    );
                  } else if (move.level > 1) {
                    from = move.level;
                  } else if (move.level === 0) {
                    from = 'Evolve';
                  }

                  return (
                    <MoveRow key={move.id} moveId={move.id} colSpan={7}>
                      <TableCell className='px-0'>{from}</TableCell>
                      <TableCell className='px-0'>
                        <a
                          href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                          target='_blank'
                          rel='noreferrer'
                          className='inline text-blue-800 underline'
                        >
                          {move.name.zh}
                        </a>
                        <br />
                        {displayLanguage === 'ja' ? move.name.ja : move.name.en}
                      </TableCell>
                      <TableCell>
                        <div className='flex justify-center'>
                          <PokemonTypes types={[move.type]} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex justify-center'>
                          <PokemonTypes types={[move.category]} />
                        </div>
                      </TableCell>
                      <TableCell>{move.power <= 0 ? '—' : move.power}</TableCell>
                      <TableCell>{move.accuracy ?? '—'}</TableCell>
                      <TableCell>{move.pp}</TableCell>
                    </MoveRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className='bg-slate-50 p-2 sm:p-4 rounded-xl border-2 border-slate-200'>
            <h4 className='font-press-start text-sm mb-4 text-slate-700 bg-white inline-block px-4 py-2 border-2 border-[#34925e] rounded shadow-[2px_2px_0_0_#34925e]'>
              TM Moves
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-2/12 min-w-[60px]'>TM</TableHead>
                  <TableHead className='w-3/12'>Name</TableHead>
                  <TableHead className='w-2/12'>Type</TableHead>
                  <TableHead className='w-2/12'>Cat.</TableHead>
                  <TableHead className='w-1/12'>Att.</TableHead>
                  <TableHead className='w-1/12'>Acc.</TableHead>
                  <TableHead className='w-1/12'>PP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...pokemon.HTMMoves, ...pokemon.TMMoves].filter(filterMove).map((move) => (
                  <MoveRow key={move.id} moveId={move.id} colSpan={6}>
                    <TableCell className='px-0'>
                      {!move.isPreEvo ? (
                        move.tm
                      ) : (
                        <div className='flex flex-col text-[10px] leading-tight text-slate-500 font-bold font-sans'>
                          <span>{move.preEvoName?.zh}</span>
                          <span>{move.tm}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='px-0'>
                      <a
                        href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                        target='_blank'
                        rel='noreferrer'
                        className='inline text-blue-800 underline'
                      >
                        {move.name.zh}
                      </a>
                      <br />
                      {displayLanguage === 'ja' ? move.name.ja : move.name.en}
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.type]} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.category]} />
                      </div>
                    </TableCell>
                    <TableCell>{move.power <= 0 ? '—' : move.power}</TableCell>
                    <TableCell>{move.accuracy ?? '—'}</TableCell>
                    <TableCell>{move.pp}</TableCell>
                  </MoveRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='bg-slate-50 p-2 sm:p-4 rounded-xl border-2 border-slate-200'>
            <h4 className='font-press-start text-sm mb-4 text-slate-700 bg-white inline-block px-4 py-2 border-2 border-[#34925e] rounded shadow-[2px_2px_0_0_#34925e]'>
              Egg Moves
            </h4>
            {pokemon.eggMoves.length > 0 && (
              <details className='mb-4 group bg-white border-2 border-slate-200 rounded-xl overflow-hidden text-left'>
                <summary className='cursor-pointer font-bold text-sm text-slate-700 p-3 bg-slate-100 list-none flex justify-between items-center hover:bg-slate-200 transition-colors [&::-webkit-details-marker]:hidden'>
                  <span>生蛋與招式遺傳法則說明</span>
                  <span className='transition-transform duration-200 group-open:rotate-180'>▼</span>
                </summary>
                <div className='p-4 text-sm text-slate-700 space-y-3 leading-relaxed'>
                  <div>
                    <strong className='text-[#34925e]'>孵化加速：</strong>
                    隊首放置特性「熔岩盔甲」或「灼熱身軀」的寶可夢（如：熔岩蝸牛、鴨嘴火龍等），可使孵蛋所需步數減半，只需一隻即可。
                  </div>
                  <div>
                    <strong className='text-[#34925e]'>子代種類：</strong>
                    <ul className='list-disc pl-5 mt-1 space-y-1'>
                      <li>
                        一般情況下，子代種類與<strong className='text-slate-900'>「母方」</strong>
                        相同。
                      </li>
                      <li>
                        若與百變怪生蛋，則子代與
                        <strong className='text-slate-900'>「非百變怪」</strong>
                        那方相同（不論公母）。
                      </li>
                      <li>百變怪與百變怪之間無法生蛋。</li>
                    </ul>
                  </div>
                  <div>
                    <strong className='text-[#34925e]'>招式遺傳：</strong>只有
                    <strong className='text-slate-900'>「公方」</strong>
                    能提供遺傳招式，且子代本身需能學會該招式。
                    <ul className='list-disc pl-5 mt-1 space-y-1'>
                      <li>
                        <strong className='text-slate-900'>蛋招式 (Egg Moves)：</strong>
                        若公方會該子代的專屬蛋招式，出生即可學會。
                      </li>
                      <li>
                        <strong className='text-slate-900'>招式機：</strong>
                        若公方會該招式，且子代可透過招式機學會，出生即可學會。
                      </li>
                      <li>
                        <strong className='text-slate-900'>升級招式：</strong>若
                        <strong className='text-slate-900'>「父母雙方」</strong>
                        都會某一招式，且子代將來升級可學會，則可「提早學會」。
                      </li>
                    </ul>
                  </div>
                </div>
              </details>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-3/12'>Name</TableHead>
                  <TableHead className='w-2/12'>Type</TableHead>
                  <TableHead className='w-2/12'>Cat.</TableHead>
                  <TableHead className='w-1/12'>Att.</TableHead>
                  <TableHead className='w-1/12'>Acc.</TableHead>
                  <TableHead className='w-1/12'>PP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pokemon.eggMoves.filter(filterMove).map((move) => (
                  <MoveRow key={move.id} moveId={move.id} colSpan={6}>
                    <TableCell className='px-0'>
                      <a
                        href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                        target='_blank'
                        rel='noreferrer'
                        className='inline text-blue-800 underline'
                      >
                        {move.name.zh}
                      </a>
                      <br />
                      {displayLanguage === 'ja' ? move.name.ja : move.name.en}
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.type]} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.category]} />
                      </div>
                    </TableCell>
                    <TableCell>{move.power <= 0 ? '—' : move.power}</TableCell>
                    <TableCell>{move.accuracy ?? '—'}</TableCell>
                    <TableCell>{move.pp}</TableCell>
                  </MoveRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='bg-slate-50 p-2 sm:p-4 rounded-xl border-2 border-slate-200'>
            <h4 className='font-press-start text-sm mb-4 text-slate-700 bg-white inline-block px-4 py-2 border-2 border-[#34925e] rounded shadow-[2px_2px_0_0_#34925e]'>
              Tutor Moves
            </h4>
            {pokemon.tutorMoves.length > 0 && (
              <details className='mb-4 group bg-white border-2 border-slate-200 rounded-xl overflow-hidden'>
                <summary className='cursor-pointer font-bold text-sm text-slate-700 p-3 bg-slate-100 list-none flex justify-between items-center hover:bg-slate-200 transition-colors [&::-webkit-details-marker]:hidden'>
                  <span>查看可學習之招式教學者位置 (Tutor Locations)</span>
                  <span className='transition-transform duration-200 group-open:rotate-180'>▼</span>
                </summary>
                <div className='p-0 overflow-x-auto'>
                  <Table className='text-sm whitespace-nowrap'>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[140px]'>招式名稱</TableHead>
                        <TableHead>位置 / 取得方式</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from(new Set(pokemon.tutorMoves.map((m) => m.name.zh))).map(
                        (moveName, index) => {
                          let location = '無此招式教學地點資訊';

                          const matchingKey = Object.keys(tutorLocations).find((key) =>
                            moveName.includes(key),
                          );

                          if (matchingKey) {
                            location = tutorLocations[matchingKey];
                          }

                          return (
                            <TableRow key={index} className='hover:bg-slate-50'>
                              <TableCell className='font-bold text-slate-700 bg-slate-50/50'>
                                {moveName}
                              </TableCell>
                              <TableCell className='text-slate-600 whitespace-normal wrap-break-word min-w-[200px]'>
                                {location}
                              </TableCell>
                            </TableRow>
                          );
                        },
                      )}
                    </TableBody>
                  </Table>
                </div>
              </details>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-3/12'>Name</TableHead>
                  <TableHead className='w-2/12'>Type</TableHead>
                  <TableHead className='w-2/12'>Cat.</TableHead>
                  <TableHead className='w-1/12'>Att.</TableHead>
                  <TableHead className='w-1/12'>Acc.</TableHead>
                  <TableHead className='w-1/12'>PP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pokemon.tutorMoves.filter(filterMove).map((move) => (
                  <MoveRow key={move.id} moveId={move.id} colSpan={6}>
                    <TableCell className='px-0'>
                      <a
                        href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                        target='_blank'
                        rel='noreferrer'
                        className='inline text-blue-800 underline'
                      >
                        {move.name.zh}
                      </a>
                      <br />
                      {displayLanguage === 'ja' ? move.name.ja : move.name.en}
                      {move.isPreEvo && (
                        <div className='text-[10px] leading-tight text-slate-500 font-bold font-sans mt-1'>
                          ({move.preEvoName?.zh} 教授)
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.type]} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.category]} />
                      </div>
                    </TableCell>
                    <TableCell>{move.power <= 0 ? '—' : move.power}</TableCell>
                    <TableCell>{move.accuracy ?? '—'}</TableCell>
                    <TableCell>{move.pp}</TableCell>
                  </MoveRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
