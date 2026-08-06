import React from "react";
import { TrendingUp, TrendingDown, Banknote, ShoppingBag } from "lucide-react";
import { getMetrics } from "@/app/lib/metrics";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-NG").format(value || 0);

export default async function DashboardMetrics() {
  const metrics = await getMetrics();

  const stats = [
    {
      title: "Today's Profit",
      value: formatCurrency(Number(metrics?.profitToday || 0)),
      previousValue: `Yesterday: ${formatCurrency(Number(metrics?.profitYesterday || 0))}`,
      icon: Banknote,
      iconWrapper: "md:bg-[#f4f8f8] md:text-slate-500 bg-[#0B7A75] text-white",
      cardClass: "bg-[#0B7A75] md:bg-white border-[#6DAFAC] text-white",
      labelClass: "md:text-slate-500 text-white/90",
      valueClass: "md:text-[#032523] text-white",
      secondaryClass: "md:text-slate-500 text-white/85",
    },
    {
      title: "Money In",
      value: formatCurrency(Number(metrics?.TotalMoneyIn || 0)),
      previousValue: `Yesterday: ${formatCurrency(Number(metrics?.moneyInYesterday || 0))}`,
      icon: TrendingUp,
      iconWrapper: "bg-[#e4f5ed] text-[#02ad5e]",
      cardClass: "bg-white",
      labelClass: "text-slate-500",
      valueClass: "text-[#032523]",
      secondaryClass: "text-slate-500",
    },
    {
      title: "Money Out",
      value: formatCurrency(Number(metrics?.totalMoneyOut || 0)),
      previousValue: `Yesterday: ${formatCurrency(Number(metrics?.moneyOutYesterday || 0))}`,
      icon: TrendingDown,
      iconWrapper: "bg-[#f9e6e8] text-[#d01527]",
      cardClass: "bg-white",
      labelClass: "text-slate-500",
      valueClass: "text-[#032523]",
      secondaryClass: "text-slate-500",
    },
    {
      title: " Today's Sales",
      value: formatNumber(Number(metrics?.totalsalescountToday || 0)),
      previousValue: `Yesterday: ${formatNumber(Number(metrics?.totalSalesCountyesterday || 0))}`,
      icon: ShoppingBag,
      iconWrapper: "bg-[#f4f8f8] text-slate-500",
      cardClass: "bg-white",
      labelClass: "text-slate-500",
      valueClass: "text-[#032523]",
      secondaryClass: "text-slate-500",
    },
  ];

  const renderStatCard = (stat: (typeof stats)[number]) => {
    const Icon = stat.icon;

    return (
      <article
        key={stat.title}
        className={`rounded-2xl  border border-[#6DAFAC]/60 p-2  md:p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${stat.cardClass}`}
      >
        <div
          className={`flex h-6 w-6 md:h-11 md:w-11  items-center justify-center rounded-xl ${stat.iconWrapper}`}
        >
          <Icon className="h-3 w-3 md:h-5 md:w-5 " />
        </div>

        <p
          className={`mt-4 text-[10px] md:text-xs  font-semibold uppercase tracking-[0.18em] ${stat.labelClass}`}
        >
          {stat.title}
        </p>

        <h3
          className={`mt-3 text-xs md:text-2xl font-bold leading-none sm:text-3xl ${stat.valueClass}`}
        >
          {stat.value}
        </h3>

        <p className={`mt-3 text-[10px] md:text-xs ${stat.secondaryClass}`}>
          {stat.previousValue}
        </p>
      </article>
    );
  };

  return (
    <section className="py-5">
      <div className="sm:hidden">
        <div className="space-y-4">
          {renderStatCard(stats[0])}

          <div className="">
            <div className="grid grid-cols-3 gap-2">
              {stats.slice(1).map((stat) => renderStatCard(stat))}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4 xl:grid-cols-4 md:gap-4">
        {stats.map((stat) => renderStatCard(stat))}
      </div>
    </section>
  );
}
