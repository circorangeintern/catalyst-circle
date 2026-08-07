import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "today";

    const now = new Date();
    let startDate: Date;

    if (period === "week") {
      // Start of current week (Monday)
      const currentDay = now.getDay();
      const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate.setDate(startDate.getDate() - distanceToMonday);
    } else if (period === "month") {
      // Start of current calendar month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      // Start of today (midnight)
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    // Load active records within range
    const [sales, expenses] = await Promise.all([
      prisma.sale.findMany({
        where: {
          userId,
          createdAt: { gte: startDate },
        },
      }),
      prisma.expense.findMany({
        where: {
          userId,
          createdAt: { gte: startDate },
        },
      }),
    ]);

    // Calculate dynamic aggregates
    const moneyIn = sales.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
    const moneyOut = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const profit = moneyIn - moneyOut;
    const totalSales = sales.length;
    const totalExpenses = expenses.length;

    return NextResponse.json({
      moneyIn,
      moneyOut,
      profit,
      totalSales,
      totalExpenses,
    });
  } catch (error) {
    console.error("API error generating summary stats:", error);
    return NextResponse.json(
      { error: "Failed to generate summary statistics" },
      { status: 500 }
    );
  }
}
