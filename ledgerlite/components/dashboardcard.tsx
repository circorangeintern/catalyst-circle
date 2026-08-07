import { Trash2, Eye, ReceiptText, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import SalesForm from "@/components/salesform";

interface DashboardItem {
  id: string;
  transaction: string;
  type: string;
  amount: number;
  timestamp: string;
}

interface DashboardCardProps {
  dashboard?: DashboardItem[];
  page?: number;
  totalPages?: number;
  totalEntries?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  isFetching?: boolean;
}

export default function DashboardCard({
  dashboard = [],
  page,
  totalPages,
  totalEntries,
  limit,
  onPageChange,
  isFetching = false,
}: DashboardCardProps) {
  const showPagination =
    typeof page === "number" &&
    typeof totalPages === "number" &&
    typeof totalEntries === "number" &&
    typeof limit === "number" &&
    onPageChange;

  const startRange = showPagination ? (page - 1) * limit + 1 : 1;
  const endRange = showPagination
    ? Math.min(page * limit, totalEntries)
    : dashboard.length;

  const getPageNumbers = () => {
    if (!totalPages) return [];
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page! <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page! >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(page! - 1);
        pages.push(page!);
        pages.push(page! + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto relative">
        {/* Subtle fetching overlay indicator */}
        {isFetching && (
          <div className="absolute right-6 top-4 z-10 flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-semibold text-teal-700 border border-teal-100 shadow-sm animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping" />
            Updating...
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Transaction
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Date
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-slate-100 transition-opacity duration-200 ${isFetching ? "opacity-60" : "opacity-100"}`}
          >
            {dashboard.map((item) => {
              const isSale =
                item.type.toLowerCase() === "sale" ||
                item.type.toLowerCase() === "sales";

              return (
                <tr key={item.id} className="transition hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {item.transaction}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-xs font-semibold ${
                        isSale
                          ? "bg-[#e4f5ed] text-[#02ad5e]"
                          : "bg-[#f9e6e8] text-[#d01527]"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`text-sm font-bold ${
                        isSale ? "text-[#02ad5e]" : "text-[#d01527]"
                      }`}
                    >
                      {isSale ? "+" : "-"}₦{item.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-500">{item.timestamp}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={isSale ? "/sales" : "/expense"}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-brand-primary/5 hover:text-brand-primary cursor-pointer"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {dashboard.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-10">
          <ReceiptText className="text-slate-400 h-8 w-8" />
          <h4 className="text-sm text-slate-900 font-semibold">
            No recent activities.
          </h4>
          <h4 className="text-center text-xs text-slate-500">
            Your sales and expense will appear here once you start recording transactions
          </h4>

          <div className="mt-2">
            <SalesForm />
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="border-t border-slate-100 bg-slate-50/75 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        {showPagination ? (
          <>
            {/* Left: showing 1 to 3 of 54 entries */}
            <p className="font-medium text-slate-500">
              {totalEntries === 0
                ? "showing 0 to 0 of 0 entries"
                : `showing ${startRange} to ${endRange} of ${totalEntries} entries`}
            </p>

            {/* Right: < 1 2 3 > pagination buttons */}
            <nav className="flex items-center gap-1.5" aria-label="Pagination">
              <button
                onClick={() => onPageChange(page! - 1)}
                disabled={page === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {getPageNumbers().map((num, idx) => {
                if (num === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="inline-flex h-8 w-8 items-center justify-center text-slate-400"
                    >
                      ...
                    </span>
                  );
                }

                const isActive = num === page;
                return (
                  <button
                    key={`page-${num}`}
                    onClick={() => onPageChange(num as number)}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? "bg-teal-600 text-white shadow-sm shadow-teal-600/10"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}

              <button
                onClick={() => onPageChange(page! + 1)}
                disabled={page === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </>
        ) : (
          <>
            <p className="text-slate-500">Showing last 5 transactions</p>
            <div className="flex gap-4">
              <Link
                href="/sales"
                className="text-[#0B7A75] font-semibold hover:underline cursor-pointer"
              >
                View All Sales
              </Link>
              <span className="text-slate-300">|</span>
              <Link
                href="/expense"
                className="text-[#0B7A75] font-semibold hover:underline cursor-pointer"
              >
                View All Expenses
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}