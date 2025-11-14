import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { PageableType } from '@/schemas/pagination.schema';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
              aria-disabled={currentPage === 0}
              className={
                currentPage === 0
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i).map((page) => {
            const displayPage = page + 1;
            const showPage =
              page === 0 ||
              page === totalPages - 1 ||
              (page >= currentPage - 1 && page <= currentPage + 1);

            const showEllipsisBefore =
              page === currentPage - 2 && currentPage > 2;
            const showEllipsisAfter =
              page === currentPage + 2 && currentPage < totalPages - 3;

            if (showEllipsisBefore || showEllipsisAfter) {
              return (
                <PaginationItem key={page}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            if (!showPage) return null;

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {displayPage}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(currentPage + 1, totalPages - 1))
              }
              aria-disabled={currentPage === totalPages - 1}
              className={
                currentPage === totalPages - 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
