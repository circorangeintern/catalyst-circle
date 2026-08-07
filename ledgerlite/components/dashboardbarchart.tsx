import { getCurrentUser } from "@/app/lib/authhelper";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import BarChartClient from "./dashboardclientchart";

export default async function BarChart() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }

  // Fetch transactions with amount and creation timestamp
  const [sales, expenses] = await Promise.all([
    prisma.sale.findMany({
      where: { userId: user.id },
      select: { totalAmount: true, createdAt: true },
    }),
    prisma.expense.findMany({
      where: { userId: user.id },
      select: { amount: true, createdAt: true },
    }),
  ]);

  // Convert Date objects and Decimals to serializable numbers and strings
  const serializableSales = sales.map((s) => ({
    totalAmount: Number(s.totalAmount),
    createdAt: s.createdAt.toISOString(),
  }));

  const serializableExpenses = expenses.map((e) => ({
    amount: Number(e.amount),
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <div>
      <BarChartClient sales={serializableSales} expenses={serializableExpenses} />
    </div>
  );
}
