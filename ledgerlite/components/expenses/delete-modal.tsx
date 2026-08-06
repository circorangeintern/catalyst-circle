"use client";

import { Trash2, Loader2 } from "lucide-react";

interface ExpenseItem {
  id: string;
  description?: string | null;
  category: string;
  amount: any;
  createdAt: string | Date;
}

interface DeleteExpenseModalProps {
  expense: ExpenseItem;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

/**
 * DeleteExpenseModal Component
 * 
 * Production-style Confirmation Modal.
 * Prompts the user before deleting a resource, displaying warning metadata (name, amount).
 * 
 * Core Design Patterns:
 * 1. Declarative Dialog: Renders in context of the selected entity.
 * 2. Event Delegation: Passes button clicks to parent orchestrators via `onConfirm` and `onClose`.
 */
export default function DeleteExpenseModal({
  expense,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteExpenseModalProps) {
  const name = expense.description || "Untitled expense";
  const amt = Number(expense.amount || 0).toLocaleString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        aria-hidden="true"
        onClick={() => !isDeleting && onClose()}
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 animate-in zoom-in-95 duration-200"
      >
        {/* Warning Content */}
        <div className="flex items-start gap-4 p-6">
          <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 sm:mx-0 sm:h-10 sm:w-10">
            <Trash2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 className="text-lg font-semibold leading-6 text-slate-900">
              Delete Expense?
            </h3>
            <div className="mt-2">
              <p className="text-sm text-slate-500">
                Are you sure you want to delete <span className="font-semibold text-slate-800">"{name}"</span> of <span className="font-semibold text-slate-800">₦{amt}</span>? This action cannot be undone and will permanently remove the record from your accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="inline-flex justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex justify-center items-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 cursor-pointer disabled:opacity-75"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Expense"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
