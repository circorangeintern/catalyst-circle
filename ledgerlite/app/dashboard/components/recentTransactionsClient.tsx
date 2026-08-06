"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardCard from "@/components/dashboardcard";

interface Transaction {
  id: string;
  transaction: string;
  type: string;
  amount: number;
  timestamp: string;
}

interface PaginationMetadata {
  totalEntries: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

interface PaginatedResponse {
  transactions: Transaction[];
  pagination: PaginationMetadata;
}

interface RecentTransactionsClientProps {
  initialData: PaginatedResponse;
  userId: string;
}

export default function RecentTransactionsClient({
  initialData,
  userId,
}: RecentTransactionsClientProps) {
  const [page, setPage] = useState(1);
  const limit = 3;

  // React Query hook coordinates state machine caching and layout update
  const { data, isFetching, error } = useQuery<PaginatedResponse>({
    queryKey: ["transactions", userId, page],
    queryFn: async () => {
      const res = await fetch(
        `/api/protected/transactions?page=${page}&limit=${limit}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }
      return res.json();
    },
    // Prevent client loading spinner on initial mount by passing server-dehydrated state
    initialData: page === 1 ? initialData : undefined,
    // Smooth navigation experience: keeps existing cards visible while next page fetches in the background
    placeholderData: (previousData) => previousData,
  });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-600 shadow-sm">
        An error occurred while loading transaction history. Please reload the dashboard.
      </div>
    );
  }

  const transactions = data?.transactions ?? [];
  const pagination = data?.pagination ?? initialData.pagination;

  return (
    <DashboardCard
      dashboard={transactions}
      page={page}
      totalPages={pagination.totalPages}
      totalEntries={pagination.totalEntries}
      limit={limit}
      onPageChange={setPage}
      isFetching={isFetching}
    />
  );
}
