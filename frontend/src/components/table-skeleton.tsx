import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return Array.from({ length: rows }).map((_, index) => (
    <TableRow key={`skeleton-${index}`}>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <TableCell key={`skeleton-cell-${colIndex}`}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}
