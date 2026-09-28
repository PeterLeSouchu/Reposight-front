import { cn } from "@/lib/utils";
import { buildPagination } from "./utils/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const items = buildPagination(page, totalPages);
  if (items.length === 0) return null;

  return (
    <nav aria-label="Pagination" className="mt-5 flex items-center justify-end gap-1">
      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-1.5 text-xs text-ink/40">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              "h-8 min-w-8 cursor-pointer rounded-full px-2 text-xs font-medium transition-colors",
              item === page
                ? "bg-iris-600 text-white"
                : "text-ink/60 hover:bg-iris-50 hover:text-iris-700"
            )}
          >
            {item}
          </button>
        )
      )}
    </nav>
  );
}
