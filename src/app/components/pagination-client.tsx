"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPagination } from "@/lib/pagination";

interface PaginationClientProps {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export function PaginationClient({
  pagination,
  onPageChange,
}: PaginationClientProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="text-muted-foreground flex-1 text-sm">
        Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} games
      </div>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(pagination.page - 1)}
                className={
                  pagination.page === 1
                    ? "pointer-events-none text-gray-400"
                    : ""
                }
              />
            </PaginationItem>
            {getPagination(pagination.page, pagination.totalPages).map(
              (page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => onPageChange(page as number)}
                      isActive={pagination.page === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(pagination.page + 1)}
                className={
                  pagination.page === pagination.totalPages
                    ? "pointer-events-none text-gray-400"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
