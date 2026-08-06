/**
 * Aggregates transaction data into 7-day weekday slots (Monday through Sunday)
 * to match standard weekly Chart.js labels.
 * 
 * @param sales Array of sales records containing totalAmount and createdAt
 * @param expenses Array of expense records containing amount and createdAt
 * @returns Object with aggregated weeklyInflow and weeklyOutflow arrays
 */
export function aggregateWeeklyTransactions(
  sales: { totalAmount: any; createdAt: Date | string }[],
  expenses: { amount: any; createdAt: Date | string }[]
) {
  const weeklyInflow = Array(7).fill(0);
  const weeklyOutflow = Array(7).fill(0);

  // Helper to map JS getDay() (0=Sunday, 1=Monday, ..., 6=Saturday) 
  // to chart index (0=Monday, 1=Tuesday, ..., 6=Sunday)
  const getWeekdayIndex = (dateString: Date | string) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  };

  sales.forEach((sale) => {
    const index = getWeekdayIndex(sale.createdAt);
    weeklyInflow[index] += Number(sale.totalAmount || 0);
  });

  expenses.forEach((expense) => {
    const index = getWeekdayIndex(expense.createdAt);
    weeklyOutflow[index] += Number(expense.amount || 0);
  });

  return { weeklyInflow, weeklyOutflow };
}
