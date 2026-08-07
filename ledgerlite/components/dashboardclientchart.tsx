"use client";

import React, { useState } from "react";
import { ChartColumnIncreasing } from "lucide-react";
import SalesForm from "./salesform";
import ExpenseForm from "./expenses/expenseform";

import { Bar } from "react-chartjs-2";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// export default function BarChartClient({inflow, outflow}:{inflow: number[], outflow: number[]}) {

//   const baroptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//   };

//   const barData = {
//     labels: [
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//       "Sunday",
//     ],
//     datasets: [
//       {
//         label: "Days vs Cashflow In",
//         data: inflow,
//         backgroundColor: ["green"],

//         borderRadius: 6,
//       },
//     ],
//     datasets2: [
//       {
//         label: "Days vs Cashflow Out",
//         data: outflow,
//         backgroundColor: ["red"],

//         borderRadius: 6,
//       },
//     ],
//   };

//   return (
//     <div>
//       <div>
//         <div>
//           <h4>Money In versus Money Out</h4>
//           <p>see how ,oney ,over through your business over</p>
//         </div>
//       </div>
//       <div className="flex flex-col items-center pt-20">
//         {/* <h3 className="text-2xl font-semibold mb-6">My page</h3> */}

//         <div className="w-full max-w-4xl ">
//           <div style={{ width: "100%", height: "380px" }}>
//             <Bar data={barData} options={baroptions} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


interface TransactionSale {
  totalAmount: number;
  createdAt: string;
}

interface TransactionExpense {
  amount: number;
  createdAt: string;
}

export default function BarChart({
  sales = [],
  expenses = [],
}: {
  sales: TransactionSale[];
  expenses: TransactionExpense[];
}) {
  const [timeframe, setTimeframe] = useState<"today" | "week" | "month">("week");

  const baroptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Process data based on timeframe state
  const getChartData = () => {
    const now = new Date();
    const todayStr = now.toDateString();

    if (timeframe === "today") {
      const labels = ["12am-4am", "4am-8am", "8am-12pm", "12pm-4pm", "4pm-8pm", "8pm-12am"];
      const inflow = Array(6).fill(0);
      const outflow = Array(6).fill(0);

      sales.forEach((s) => {
        const d = new Date(s.createdAt);
        if (d.toDateString() === todayStr) {
          const hour = d.getHours();
          const bucketIndex = Math.min(5, Math.floor(hour / 4));
          inflow[bucketIndex] += s.totalAmount;
        }
      });

      expenses.forEach((e) => {
        const d = new Date(e.createdAt);
        if (d.toDateString() === todayStr) {
          const hour = d.getHours();
          const bucketIndex = Math.min(5, Math.floor(hour / 4));
          outflow[bucketIndex] += e.amount;
        }
      });

      return { labels, inflow, outflow };
    }

    if (timeframe === "month") {
      const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
      const inflow = Array(5).fill(0);
      const outflow = Array(5).fill(0);
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      sales.forEach((s) => {
        const d = new Date(s.createdAt);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          const date = d.getDate();
          const bucketIndex = Math.min(4, Math.floor((date - 1) / 7));
          inflow[bucketIndex] += s.totalAmount;
        }
      });

      expenses.forEach((e) => {
        const d = new Date(e.createdAt);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          const date = d.getDate();
          const bucketIndex = Math.min(4, Math.floor((date - 1) / 7));
          outflow[bucketIndex] += e.amount;
        }
      });

      return { labels, inflow, outflow };
    }

    // Default: "week"
    const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const inflow = Array(7).fill(0);
    const outflow = Array(7).fill(0);

    // Calculate current week bounds (Monday - Sunday)
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    sales.forEach((s) => {
      const d = new Date(s.createdAt);
      if (d >= startOfWeek && d <= endOfWeek) {
        const jsDay = d.getDay();
        const index = jsDay === 0 ? 6 : jsDay - 1;
        inflow[index] += s.totalAmount;
      }
    });

    expenses.forEach((e) => {
      const d = new Date(e.createdAt);
      if (d >= startOfWeek && d <= endOfWeek) {
        const jsDay = d.getDay();
        const index = jsDay === 0 ? 6 : jsDay - 1;
        outflow[index] += e.amount;
      }
    });

    return { labels, inflow, outflow };
  };

  const { labels, inflow, outflow } = getChartData();

  const barData = {
    labels,
    datasets: [
      {
        label: "Cashflow In",
        data: inflow,
        backgroundColor: ["#02AD5E"],
        borderRadius: 6,
      },
      {
        label: "Cashflow Out",
        data: outflow,
        backgroundColor: ["#D01527"],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div>
      {/* the bar chart */}
      <div className="border border-gray-300 dark:border-slate-800 shadow-sm p-5 rounded-4xl my-5 bg-white dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <h4 className="text-sm text-gray-900 dark:text-slate-50 font-semibold">
              Money In versus Money Out
            </h4>
            <p className="text-xs text-gray-700 dark:text-slate-400">
              see how money moves through your business over time
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* desktop buttons */}
            <div className="hidden md:block">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTimeframe("today")}
                  className={`py-1 px-3 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${
                    timeframe === "today"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200"
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setTimeframe("week")}
                  className={`py-1 px-3 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${
                    timeframe === "week"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200"
                  }`}
                >
                  This week
                </button>
                <button
                  type="button"
                  onClick={() => setTimeframe("month")}
                  className={`py-1 px-3 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${
                    timeframe === "month"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200"
                  }`}
                >
                  This month
                </button>
              </div>
            </div>
            {/* mobile selector */}
            <div className="md:hidden">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="rounded-2xl text-xs text-teal-700 border border-teal-700 px-3 py-1.5 bg-white dark:bg-slate-800 cursor-pointer"
                name="timeframe"
                id="time"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="bg-[#02AD5E] h-2 w-6 rounded-lg"></div>
                <p className="text-[10px] md:text-xs text-gray-700 dark:text-slate-400">Money In</p>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <div className="bg-[#D01527] h-2 w-6 rounded-lg"></div>
                <p className="text-[10px] md:text-xs text-gray-700 dark:text-slate-400">Money Out</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center pt-10">
          <div className="w-full max-w-4xl">
            <div style={{ width: "100%", height: "380px" }}>
              <Bar data={barData} options={baroptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}