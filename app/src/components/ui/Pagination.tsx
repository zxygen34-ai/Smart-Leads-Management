import { Button } from '@/components/ui/Button';

type PaginationProps = {
  current: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
};

export function Pagination({ current, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);
  const hasMore = totalPages > pages.length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm text-muted">
        Page {current} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={current <= 1}
          onClick={() => onPageChange?.(current - 1)}
        >
          Previous
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            variant={page === current ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange?.(page)}
          >
            {page}
          </Button>
        ))}
        {hasMore ? <span className="px-2 text-sm text-muted">...</span> : null}
        <Button
          variant="ghost"
          size="sm"
          disabled={current >= totalPages}
          onClick={() => onPageChange?.(current + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
