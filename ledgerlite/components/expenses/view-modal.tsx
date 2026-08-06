"use client";

import { X } from "lucide-react";

interface ExpenseItem {
  id: string;
  description?: string | null;
  category: string;
  amount: any;
  createdAt: string | Date;
}

interface ViewExpenseModalProps {
  expense: ExpenseItem;
  onClose: () => void;
}

/**
 * ViewExpenseModal Component
 * 
 * Production-style Single Responsibility Component.
 * Its ONLY job is to display a read-only view of a single expense record.
 * 
 * Core Design Patterns:
 * 1. Controlled Component: Visibility is controlled entirely by the parent component mounting/unmounting it.
 * 2. Unidirectional Data Flow: Receives the read-only `expense` state and notifies parent to close via `onClose` callback.
 */
export default function ViewExpenseModal({ expense, onClose }: ViewExpenseModalProps) {
  const descriptionText = expense.description || "No Description";
  const amountValue = Number(expense.amount || 0);

  // Formatted date string for display
  let formattedDate = "";
  if (expense.createdAt && !isNaN(Date.parse(String(expense.createdAt)))) {
    formattedDate = new Date(expense.createdAt).toLocaleString(undefined, {
      dateStyle: "long",
      timeStyle: "medium",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-in fade-in duration-150">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 animate-in zoom-in-95 duration-200"
      >
        {/* Header Block */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Expense Details</h2>
            <p className="mt-1 text-xs text-slate-500">ID: {expense.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Read-Only Grid */}
        <div className="px-6 py-6 space-y-4">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Description</span>
            <span className="text-sm font-semibold text-slate-900">{descriptionText}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Category</span>
            <span className="text-sm font-semibold text-slate-900">{expense.category}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Amount</span>
            <span className="text-sm font-semibold text-red-600">₦{amountValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Date Added</span>
            <span className="text-sm font-semibold text-slate-900">{formattedDate}</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center rounded-2xl bg-[#0b7a75] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#09615e] cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
