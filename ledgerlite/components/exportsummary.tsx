import React, { useState } from "react";
import { Download, Menu } from "lucide-react";

/**
 * LedgerLite - Export Summary (Responsive)
 * Desktop (md+): left sidebar with radio options, right-side live preview
 * Mobile (<md): stacked layout with pill tabs for period selection
 */

type Period = "today" | "week" | "month";
type ExportFormat = "pdf" | "image";

const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

const FORMAT_OPTIONS: { id: ExportFormat; label: string }[] = [
  { id: "pdf", label: "Export PDF" },
  { id: "image", label: "Export image" },
];

const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
};

interface SummaryData {
  moneyIn: number;
  moneyOut: number;
  profit: number;
  totalSales: number;
  totalExpenses: number;
}

// Mock figures per period — swap for real data from the backend
const SUMMARY_BY_PERIOD: Record<Period, SummaryData> = {
  today: {
    moneyIn: 250000,
    moneyOut: 120000,
    profit: 130000,
    totalSales: 24,
    totalExpenses: 5,
  },
  week: {
    moneyIn: 1450000,
    moneyOut: 620000,
    profit: 830000,
    totalSales: 142,
    totalExpenses: 31,
  },
  month: {
    moneyIn: 5200000,
    moneyOut: 2100000,
    profit: 3100000,
    totalSales: 510,
    totalExpenses: 98,
  },
};

function formatNaira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

function RadioRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex w-full items-center justify-between py-3 text-left"
    >
      <span className="text-sm text-slate-700 ">{label}</span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 cursor-pointer ${
          selected ? "border-teal-600" : "border-slate-300"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />}
      </span>
    </button>
  );
}

function PillTab({
  label,
  active,
  onSelect,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
        active
          ? "border-teal-600 bg-teal-600 text-white"
          : "border-slate-200 text-slate-600 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-teal-50 bg-[#F4F8F8] px-5 py-4 sm:px-6 sm:py-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1.5 text-xl font-bold text-teal-700 sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function StatsGrid({ data }: { data: SummaryData }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5">
      <StatCard label="Money In" value={formatNaira(data.moneyIn)} />
      <StatCard label="Money Out" value={formatNaira(data.moneyOut)} />
      <StatCard label="Profit" value={formatNaira(data.profit)} />
      <StatCard label="Total Sales" value={String(data.totalSales)} />
      <StatCard label="Total Expenses" value={String(data.totalExpenses)} />
    </div>
  );
}

function FormatRadioGroup({
  format,
  onChange,
  layout = "stacked",
}: {
  format: ExportFormat;
  onChange: (f: ExportFormat) => void;
  layout?: "stacked" | "inline";
}) {
  if (layout === "inline") {
    return (
      <div className="flex flex-wrap items-center gap-6">
        {FORMAT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className="flex items-center gap-2"
          >
            <span className="text-sm text-slate-700">{opt.label}</span>
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 cursor-pointer ${
                format === opt.id ? "border-teal-600" : "border-slate-300"
              }`}
            >
              {format === opt.id && (
                <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
              )}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-50">
      {FORMAT_OPTIONS.map((opt) => (
        <RadioRow
          key={opt.id}
          label={opt.label}
          selected={format === opt.id}
          onSelect={() => onChange(opt.id)}
        />
      ))}
    </div>
  );
}

export default function LedgerLiteExportSummary({
  businessName = "BusinessName",
  onExport,
  onCancel,
}: {
  businessName?: string;
  onExport?: (period: Period, format: ExportFormat) => void;
  onCancel?: () => void;
}) {
  const [period, setPeriod] = useState<Period>("today");
  const [format, setFormat] = useState<ExportFormat>("pdf");

  const data = SUMMARY_BY_PERIOD[period];

  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden  bg-white">
      {/* Mobile-only header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 lg:hidden">
        {/* <Menu className="h-5 w-5 text-slate-600" /> */}
        <h1 className="text-lg font-bold text-slate-900">Export Summary</h1>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Desktop sidebar (options) */}
        <div className="hidden w-72 shrink-0 border-r border-slate-100 px-6 py-8 lg:block">
          <h3 className="mb-2 text-sm font-semibold text-slate-800">Period</h3>
          <div className="mb-2 divide-y divide-slate-50">
            {PERIOD_OPTIONS.map((opt) => (
              <RadioRow
                key={opt.id}
                label={opt.label}
                selected={period === opt.id}
                onSelect={() => setPeriod(opt.id)}
              />
            ))}
          </div>

          <h3 className="mb-2 mt-8 text-sm font-semibold text-slate-800">
            Export format
          </h3>
          <div className="mb-8">
            <FormatRadioGroup
              format={format}
              onChange={setFormat}
              layout="stacked"
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onExport?.(period, format)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={onCancel}
              className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Preview panel (shared, layout adapts) */}
        <div className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <h2 className="hidden text-xl font-bold text-slate-900 lg:block">
            Summary Preview
          </h2>
          <p className="mt-1 hidden text-sm text-slate-500 lg:block">
            Period: {PERIOD_LABELS[period]}
          </p>

          {/* Mobile-only: "Summary Preview" label + pill tabs for period */}
          <div className="lg:hidden">
            <p className="mb-3 text-sm font-medium text-slate-800">
              Summary Preview
            </p>
            <div className="mb-6 flex gap-2 overflow-x-auto ">
              {PERIOD_OPTIONS.map((opt) => (
                <PillTab
                  key={opt.id}
                  label={opt.label}
                  active={period === opt.id}
                  onSelect={() => setPeriod(opt.id)}
                />
              ))}
            </div>
          </div>

          <h3 className="mt-6 mb-4 text-base font-semibold text-slate-800 sm:mt-6 sm:mb-5 sm:text-lg md:mt-6">
            {businessName}
          </h3>

          <StatsGrid data={data} />

          {/* Mobile-only: export format + action buttons below preview */}
          <div className="mt-8 lg:hidden">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Export format
            </h3>
            <FormatRadioGroup
              format={format}
              onChange={setFormat}
              layout="inline"
            />

            <div className="mt-8 space-y-3">
              <button
                onClick={() => onExport?.(period, format)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={onCancel}
                className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
