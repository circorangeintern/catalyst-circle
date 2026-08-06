import { getCurrentUser } from "@/app/lib/authhelper";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import BarChartClient from "./dashboardclientchart";
import { aggregateWeeklyTransactions } from "@/app/lib/chartUtils";

export default async function BarChart() {
    const user = await getCurrentUser()
    if(!user){
        redirect("/signin")
    }

    // Fetch transactions with amount and creation timestamp
    const [sales, expenses] = await Promise.all([
        prisma.sale.findMany({
            where: { userId: user.id },
            select: { totalAmount: true, createdAt: true }
        }),
        prisma.expense.findMany({
            where: { userId: user.id },
            select: { amount: true, createdAt: true }
        })
    ]);

    // Delegate processing to modular chart utility
    const { weeklyInflow, weeklyOutflow } = aggregateWeeklyTransactions(sales, expenses);

    return (
        <div>
            <BarChartClient inflow={weeklyInflow} outflow={weeklyOutflow}/>
        </div>
    );
}
