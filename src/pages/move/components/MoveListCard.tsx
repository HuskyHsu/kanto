import { PokemonTypes } from '@/components/pokemon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import MoveRow from '@/pages/pokemon/components/MoveRow';
import type { MoveList } from '@/types/move';

interface MoveListCardProps {
  moveList: MoveList;
  selectedMoveIds: number[];
  onToggleMove: (moveId: number) => void;
}

export default function MoveListCard({
  moveList,
  selectedMoveIds,
  onToggleMove,
}: MoveListCardProps) {
  const { displayLanguage, showSubtitle, toggleSubtitle } = useLanguage();
  const isSelectionFull = selectedMoveIds.length >= 6;

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between gap-2'>
        <CardTitle>Move List ({moveList.length} moves)</CardTitle>
        <button
          type='button'
          onClick={toggleSubtitle}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border transition-all cursor-pointer select-none',
            showSubtitle
              ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200',
          )}
          title='切換是否顯示雙語對照'
        >
          <span className='font-sans'>
            {showSubtitle
              ? displayLanguage === 'ja'
                ? '雙語 (日+中)'
                : '雙語 (英+中)'
              : displayLanguage === 'ja'
                ? '僅顯示日文'
                : '僅顯示英文'}
          </span>
        </button>
      </CardHeader>
      <CardContent className='px-0 md:px-6'>
        <div className='text-center'>
          <Table className='table-fixed w-full min-w-[360px]'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[32px] min-w-[32px] px-0 text-center'>✓</TableHead>
                <TableHead className='w-[50px] min-w-[50px] px-0.5 text-center'>TM</TableHead>
                <TableHead className='w-auto min-w-[90px] px-1 text-left'>Name</TableHead>
                <TableHead className='w-[44px] min-w-[44px] px-0.5 text-center'>Type</TableHead>
                <TableHead className='w-[44px] min-w-[44px] px-0.5 text-center'>Cat.</TableHead>
                <TableHead className='w-[38px] min-w-[38px] px-0.5 text-center'>Att.</TableHead>
                <TableHead className='w-[38px] min-w-[38px] px-0.5 text-center'>Acc.</TableHead>
                <TableHead className='w-[36px] min-w-[36px] px-0.5 text-center'>PP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moveList.map((move) => {
                const isSelected = selectedMoveIds.includes(move.id);
                return (
                  <MoveRow key={move.id} moveId={move.id} colSpan={8}>
                    <TableCell className='px-0 text-center' onClick={(e) => e.stopPropagation()}>
                      <div className='flex justify-center'>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => onToggleMove(move.id)}
                          disabled={!isSelected && isSelectionFull}
                        />
                      </div>
                    </TableCell>
                    <TableCell className='px-0 text-center'>{move.tm || '—'}</TableCell>
                    <TableCell className='px-1 text-left whitespace-normal break-words'>
                      <span
                        className={cn(
                          'text-[13px] sm:text-sm font-bold text-slate-900 leading-tight break-words block',
                          displayLanguage === 'ja' && 'font-pixel-jp tracking-wide',
                        )}
                      >
                        {displayLanguage === 'ja' ? move.name.ja : move.name.en}
                      </span>
                      {showSubtitle && (
                        <div>
                          <a
                            href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                            target='_blank'
                            rel='noreferrer'
                            className='inline-block text-sm sm:text-[15px] font-semibold font-sans tracking-normal text-blue-600 underline underline-offset-2 hover:text-blue-800 leading-snug break-words mt-0.5 transition-colors'
                            title='前往神奇寶貝百科'
                            onClick={(e) => e.stopPropagation()}
                          >
                            {move.name.zh}
                          </a>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='px-0.5 text-center'>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.type]} />
                      </div>
                    </TableCell>
                    <TableCell className='px-0.5 text-center'>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.category]} />
                      </div>
                    </TableCell>
                    <TableCell className='px-0.5 text-center'>
                      {move.power <= 0 ? '—' : move.power}
                    </TableCell>
                    <TableCell className='px-0.5 text-center'>{move.accuracy ?? '—'}</TableCell>
                    <TableCell className='px-0.5 text-center'>{move.pp}</TableCell>
                  </MoveRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
