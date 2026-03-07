import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface MoveRowProps {
  moveId: number;
  colSpan: number;
  className?: string;
  children: React.ReactNode;
}

export default function MoveRow({ className, children }: MoveRowProps) {
  return (
    <>
      <TableRow
        className={cn(
          'cursor-pointer transition-colors',
          'bg-white hover:bg-slate-100',
          'border-b-2 border-slate-200',
          className,
        )}
      >
        {children}
      </TableRow>
    </>
  );
}
