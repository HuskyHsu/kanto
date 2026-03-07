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
          'cursor-pointer hover:bg-muted/50 transition-colors',
          'bg-muted/50',
          className,
        )}
      >
        {children}
      </TableRow>
    </>
  );
}
