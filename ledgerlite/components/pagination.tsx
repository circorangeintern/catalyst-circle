"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalEntries?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalEntries,
  onPageChange,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const showLabel = typeof totalEntries === "number";
  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = showLabel
    ? Math.min(currentPage * pageSize, totalEntries!)
    : currentPage * pageSize;

  function handlePageChange(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > totalPages) return;

    if (onPageChange) {
      onPageChange(pageNumber);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(pageNumber));

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }
  }

  function getPageNumbers(current: number, total: number) {
    const pages: (number | string)[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (current > 3) {
        pages.push("...");
      }
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (current < total - 2) {
        pages.push("...");
      }
      pages.push(total);
    }
    return pages;
  }

  const buttonsLayout = (
    <nav className="flex items-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isPending}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition-colors disabled:cursor-not-allowed"
        title="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers(currentPage, totalPages).map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-8 w-8 items-center justify-center text-slate-400 select-none font-medium text-xs"
            >
              ...
            </span>
          );
        }

        const pageIndex = Number(page);
        const isCurrent = pageIndex === currentPage;

        return (
          <button
            key={`page-${pageIndex}`}
            type="button"
            onClick={() => handlePageChange(pageIndex)}
            disabled={isPending}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition cursor-pointer ${
              isCurrent
                ? "bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/10"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            title={`Page ${pageIndex}`}
          >
            {pageIndex}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isPending}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition-colors disabled:cursor-not-allowed"
        title="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );

  return (
    <div
      className={`flex items-center gap-4 w-full ${
        isPending ? "opacity-70" : ""
      } ${
        showLabel
          ? "flex-col sm:flex-row justify-between"
          : "justify-center"
      }`}
    >
      {showLabel && (
        <p className="text-xs font-medium text-slate-500">
          {totalEntries === 0
            ? "showing 0 to 0 of 0 entries"
            : `showing ${startRange} to ${endRange} of ${totalEntries} entries`}
        </p>
      )}
      {buttonsLayout}
    </div>
  );
}