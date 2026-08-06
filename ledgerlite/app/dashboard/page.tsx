import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import { getCurrentUser } from "../lib/authhelper";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Receipt, Package, Loader2 } from "lucide-react";
import { Suspense } from "react";
import DashboardMetrics from "./components/dashboardMetrices";
import { LowStockSkeleton, MetricsSkeleton, TransactionsSkeleton } from "./components/skeletons";
import LowStockAlerts from "./components/lowStockAlerts";
import RecentTransactions from "./components/recentTransactions";
import BarChart from "@/components/dashboardbarchart";
import WelcomeGreeting from "@/components/welcomeGreeting";


export default async function Dashboard() {
  
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  const { name, buisnessName } = user

  // Pre-calculate server time greeting for initial paint
  const hours = new Date().getHours();
  let initialGreeting = "Good morning";
  if (hours >= 12 && hours < 18) {
    initialGreeting = "Good afternoon";
  } else if (hours >= 18 || hours < 5) {
    initialGreeting = "Good evening";
  }

  return (
    <div>
      {/* Sidebar navigation */}
      <div>
        <SideNav />
      </div>
      <div className="ml-0 md:ml-60 sm:ml-0">
        <UserNav name={name} buisnessName={buisnessName} />
      </div>

      <main className="ml-0 md:ml-62 sm:ml-0 p-4">
        {/* Good morning heading */}
        <section>
          <div className="space-y-4">
            <div>
              <WelcomeGreeting name={name} initialGreeting={initialGreeting} />
              <p className="text-slate-600 dark:text-slate-400">
              
                Here’s a quick look at how your business today
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard boxes (insight metrics) - Streamed with Suspense */}
        <section>
          <Suspense fallback={<MetricsSkeleton />}>
            <DashboardMetrics />
          </Suspense>
        </section>

        {/* Quick Actions and Alerts */}
        <section>
          <div className="lg:flex gap-6">
            {/* Quick Actions */}
            <div className=" md:border md:border-gray-200 md:shadow-sm md:px-5 rounded-2xl bg-white flex-1 py-0 md:py-2">
              <p className="p-3 font-semibold text-sm text-slate-700">
                Quick Actions
              </p>

              <div className="flex justify-between items-center gap-2 md:space-x-5">
                <div className="py-2  flex-1">
                  <Link
                    className="flex flex-col items-center text-white bg-[#0B7A75] rounded-2xl px-4  py-5  md:py-20 hover:opacity-80 transition duration-150"
                    href="/sales"
                  >
                    <ShoppingBag className="space-y-2" size={15} />
                    <span className="flex items-center gap-2 py-2 text-xs md:text-sm">
                      <span className="hidden md:block">Add</span> Sales
                    </span>
                  </Link>
                </div>
                <div className="py-2 flex-1">
                  <Link
                    className="flex flex-col items-center text-white bg-[#0B7A75] rounded-2xl px-4 py-5 md:py-20 hover:opacity-80 transition duration-150"
                    href="/expense"
                  >
                    <Receipt size={15} />
                    <span className="flex items-center gap-2 py-2 text-xs md:text-sm">
                      <span className="hidden md:block">Add</span> Expense
                    </span>
                  </Link>
                </div>
                <div className="py-2 flex-1">
                  <Link
                    className="flex flex-col items-center text-white bg-[#0B7A75] rounded-2xl px-4 py-5 md:py-20 hover:opacity-80 transition duration-150"
                    href="/inventory"
                  >
                    <Package size={15} />
                    <span className="flex items-center gap-2 py-2 text-xs md:text-sm">
                      <span className="hidden md:block">Add</span> Inventory
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div>
              {/* Low stock alerts - Streamed with Suspense */}
              <Suspense fallback={<LowStockSkeleton />}>
                <LowStockAlerts />
              </Suspense>
            </div>
          </div>
          <div>
            <Suspense
              fallback={
                <p className="mt-10 flex items-center justify-center animate-spin">
                  {" "}
                  <Loader2 className="text-teal-600"/> 
                  
                </p>
              }
            >
              <BarChart />
            </Suspense>
          </div>
        </section>
        {/* Transaction history - Streamed with Suspense */}
        <section>
          <div className="my-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Recent Transactions
            </h2>
            <Suspense fallback={<TransactionsSkeleton />}>
              <RecentTransactions userId={user.id} />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}
