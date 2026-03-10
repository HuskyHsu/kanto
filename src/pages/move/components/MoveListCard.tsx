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
  const { displayLanguage } = useLanguage();
  const isSelectionFull = selectedMoveIds.length >= 6;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Move List ({moveList.length} moves)</CardTitle>
      </CardHeader>
      <CardContent className='px-0 md:px-6'>
        <div className='text-center'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='px-0 w-1/12 min-w-[40px]'>✓</TableHead>
                <TableHead className='px-0 w-2/12'>TM</TableHead>
                <TableHead className='px-0 w-4/12'>Name</TableHead>
                <TableHead className='px-1 w-1/12'>Type</TableHead>
                <TableHead className='px-1 w-1/12'>Cat.</TableHead>
                <TableHead className='px-1 w-1/12'>Att.</TableHead>
                <TableHead className='px-1 w-1/12'>Acc.</TableHead>
                <TableHead className='px-1 w-1/12'>PP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moveList.map((move) => {
                const isSelected = selectedMoveIds.includes(move.id);
                return (
                  <MoveRow key={move.id} moveId={move.id} colSpan={7}>
                    <TableCell className='px-0' onClick={(e) => e.stopPropagation()}>
                      <div className='flex justify-center'>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => onToggleMove(move.id)}
                          disabled={!isSelected && isSelectionFull}
                        />
                      </div>
                    </TableCell>
                    <TableCell className='px-0'>{move.tm || '—'}</TableCell>
                    <TableCell className='px-0'>
                      <a
                        href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                        target='_blank'
                        rel='noreferrer'
                        className='inline text-blue-800 underline'
                        onClick={(e) => e.stopPropagation()}
                      >
                        {move.name.zh}
                      </a>
                      <br />
                      {displayLanguage === 'ja' ? move.name.ja : move.name.en}
                    </TableCell>
                    <TableCell className='px-0'>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.type]} />
                      </div>
                    </TableCell>
                    <TableCell className='px-0'>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.category]} />
                      </div>
                    </TableCell>
                    <TableCell className='px-0'>{move.power <= 0 ? '—' : move.power}</TableCell>
                    <TableCell className='px-0'>{move.accuracy ?? '—'}</TableCell>
                    <TableCell className='px-0'>{move.pp}</TableCell>
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
