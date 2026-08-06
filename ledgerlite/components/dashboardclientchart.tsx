"use client";

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


export default function BarChart({ inflow, outflow }: { inflow: number[], outflow: number[] }) {
  const baroptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const barData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Days vs Cashflow In",
        data: inflow,
        backgroundColor: ["green"],

        borderRadius: 6,
      },
      {
        label: "Days vs Cashflow Out",
        data: outflow,
        backgroundColor: ["red"],

        borderRadius: 6,
      },
    ],
  };

  return (
    <div>
      <div>
        {/* <div className="border border-gray-300 shadow-sm p-5 rounded-4xl my-5">
          <div className=" flex justify-around  gap-10">
            <div>
              <h4 className="text-sm text-gray-900 font-semibold">
                Money In versus Money Out
              </h4>
              <p className="text-xs text-gray-700">
                see how money moves through your business over time
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <button className="bg-gray-300 py-1 px-2 rounded-lg text-xs text-gray-700 cursor-pointer">
                  Today
                </button>
                <button className="bg-gray-300 py-1 px-2 rounded-lg text-xs text-gray-700 cursor-pointer">
                  This week
                </button>
                <button className="bg-gray-300 py-1 px-2 rounded-lg text-xs text-gray-700 cursor-pointer">
                  This month
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center py-5 ">
            <ChartColumnIncreasing className="text-slate-900" />
            <h3 className="text-2xl text-slate-900 font-semibold mb-6">
              No transaction
            </h3>
            <p className="text-sm text-center text-gray-700">
              Record your first sales or expense to see how your money moves
              thrugh your business
            </p>
            <div className="md:flex">
              <SalesForm />
              <ExpenseForm />
            </div>
          </div>
        </div> */}
      </div>
      {/* the bar chart */}
      <div className="border border-gray-300 shadow-sm p-5 rounded-4xl my-5">
        <div className=" flex justify-around  gap-10">
          <div>
            <h4 className="text-sm text-gray-900 font-semibold">
              Money In versus Money Out
            </h4>
            <p className="text-xs text-gray-700">
              see how money moves through your business over time
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* desktop buttons */}
            <div className="hidden md:block">
               <div className="flex gap-2">
              <button className="bg-gray-300 py-1 px-2 rounded-lg text-[10px] text-gray-700 cursor-pointer">
                Today
              </button>
              <button className="bg-gray-300 py-1 px-2 rounded-lg text-[10px] text-gray-700 cursor-pointer">
                This week
              </button>
              <button className="bg-gray-300 py-1 px-2 rounded-lg text-[10px] text-gray-700 cursor-pointer">
                This month
              </button>
            </div>
            </div>
            {/* mobile buttons */}
           
            <div className="md:hidden">
              <select className="rounded-2xl text-xs text-teal-700 border border-teal-700" name="timeframe" id="time">
                <option value="today">Today</option>
                <option value="thisweek">This Week</option>
                <option value="thismonth">This Month</option>
              </select>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="bg-[#02AD5E] h-2 w-6 rounded-lg"></div>
                <p className="text-[10px] md:text-xs text-gray-700">Money In</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-[#D01527] h-2 w-6 rounded-lg"></div>
                <p className="text-[10px] md:text-xs text-gray-700">Money Out</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center pt-10">
          {/* <h3 className="text-2xl font-semibold mb-6">My page</h3> */}

          <div className="w-full max-w-4xl ">
            <div style={{ width: "100%", height: "380px" }}>
              <Bar data={barData} options={baroptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}