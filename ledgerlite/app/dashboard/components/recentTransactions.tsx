import React from "react";
import prisma from "@/app/lib/prisma";
import RecentTransactionsClient from "./recentTransactionsClient";

interface RecentTransactionsProps {
  userId: string;
}

export default async function RecentTransactions({ userId }: RecentTransactionsProps) {
  const limit = 3;
  const page = 1;
  const skip = 0;

  // Pre-fetch initial page 1 on the server to support instant static page load (SEO / SSR friendly)
  const [sales, expenses, totalSales, totalExpenses] = await Promise.all([
    prisma.sale.findMany({
      where: { userId },
      include: { item: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.expense.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.sale.count({ where: { userId } }),
    prisma.expense.count({ where: { userId } }),
  ]);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  const formattedSales = sales.map((sale) => ({
    id: sale.id,
    transaction: sale.item?.name || sale.customItemName || "Untracked Sale",
    type: "Sale",
    amount: Number(sale.totalAmount),
    timestamp: formatter.format(new Date(sale.createdAt)),
    createdAt: sale.createdAt.toISOString(),
  }));

  const formattedExpenses = expenses.map((expense) => ({
    id: expense.id,
    transaction: expense.description || expense.category || "General Expense",
    type: "Expense",
    amount: Number(expense.amount),
    timestamp: formatter.format(new Date(expense.createdAt)),
    createdAt: expense.createdAt.toISOString(),
  }));

  const allTransactions = [...formattedSales, ...formattedExpenses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const paginatedTransactions = allTransactions.slice(skip, skip + limit);
  const totalEntries = totalSales + totalExpenses;
  const totalPages = Math.ceil(totalEntries / limit);

  const initialData = {
    transactions: paginatedTransactions,
    pagination: {
      totalEntries,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    },
  };

  return <RecentTransactionsClient initialData={initialData} userId={userId} />;
}
