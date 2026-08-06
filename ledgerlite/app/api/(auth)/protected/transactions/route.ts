import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 3;
    const skip = (page - 1) * limit;

    // Fetch the top (page * limit) of both resources to execute a clean memory-level merge and sort,
    // which guarantees chronological consistency without database-specific raw SQL UNION operations.
    const [sales, expenses, totalSales, totalExpenses] = await Promise.all([
      prisma.sale.findMany({
        where: { userId },
        include: { item: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: page * limit,
      }),
      prisma.expense.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: page * limit,
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

    return NextResponse.json({
      transactions: paginatedTransactions,
      pagination: {
        totalEntries,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("API error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to load transactions" },
      { status: 500 }
    );
  }
}
