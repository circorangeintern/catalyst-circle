"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface ExpenseItem {
  id: string;
  description?: string | null;
  category: string;
  amount: any;
  createdAt: string | Date;
}

interface EditExpenseModalProps {
  expense: ExpenseItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { description: string; category: string; amount: number }) => Promise<void>;
  isPending: boolean;
}

export default function EditExpenseModal({
  expense,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: EditExpenseModalProps) {
  // Local form states
  const [description, setDescription] = useState(expense.description || "");
  const [category, setCategory] = useState(expense.category || "");
  const [amount, setAmount] = useState(String(expense.amount || ""));
  const [editError, setEditError] = useState<string | null>(null);

  // Synchronize state values when target expense switches
  useEffect(() => {
    setDescription(expense.description || "");
    setCategory(expense.category || "");
    setAmount(String(expense.amount || ""));
    setEditError(null);
  }, [expense]);

  if (!isOpen) return null;

  async function handleUpdateExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEditError(null);

    const updatedData = {
      description,
      category,
      amount: Number(amount),
    };

    try {
      await onConfirm(updatedData);
    } catch (err: any) {
      console.error("Update expense error:", err);
      setEditError(err.message || "Something went wrong.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={() => !isPending && onClose()}
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Edit Expense</h2>
            <p className="mt-1 text-xs text-slate-500">
              Update details for Expense ID: {expense.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            disabled={isPending}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleUpdateExpense} className="space-y-4 px-6 py-5">
          {editError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-xl text-xs">
              {editError}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-desc" className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <input
                id="edit-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75]"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-cat" className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <input
                id="edit-cat"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75]"
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-amt" className="block text-sm font-medium text-slate-700">
                ₦ Amount
              </label>
              <input
                id="edit-amt"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75]"
                disabled={isPending}
                required
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-200 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="inline-flex justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex justify-center items-center gap-2 rounded-2xl bg-[#0b7a75] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#09615e] cursor-pointer disabled:opacity-75"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Expense"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
