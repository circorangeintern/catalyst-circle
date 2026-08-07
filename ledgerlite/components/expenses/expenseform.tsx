"use client";

import { useEffect, useState, useTransition } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { sendGAEvent } from "@next/third-parties/google";

interface ExpenseFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  onAddExpense?: (data: {
    description: string;
    category: string;
    amount: number;
  }) => Promise<void>;
}

export default function ExpenseForm({
  open,
  onOpenChange,
  hideTrigger = false,
  onAddExpense,
}: ExpenseFormProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = typeof open === "boolean" ? open : internalOpen;
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof open === "boolean" && open !== internalOpen) {
      setInternalOpen(open);
    }
  }, [open]);

  const handleOpen = (value: boolean) => {
    if (typeof onOpenChange === "function") {
      onOpenChange(value);
    }
    if (typeof open !== "boolean") {
      setInternalOpen(value);
    }
  };

  function resetForm() {
    setDescription("");
    setCategory("");
    setAmount(0);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!category || amount <= 0) {
      toast.error("Please enter a valid category and amount.");
      return;
    }

    startTransition(async () => {
      try {
        if (onAddExpense) {
          await onAddExpense({ description, category, amount });
        } else {
          const res = await fetch("/api/routes/expenses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ description, category, amount }),
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.message || "Failed to save expense");
          }
          router.refresh();
        }
        toast.success("Expense recorded successfully!");
        handleOpen(false);
        resetForm();
      } catch (err: any) {
        console.error("Save expense error:", err);
        toast.error(err.message || "Failed to save expense.");
      }
    });
  }

  return (
    <div className="px-4 py-6">
      {!hideTrigger && (
        <div>
          <button
            type="button"
            onClick={() => handleOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-brand-primary px-2 md:px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer"
          >
            <Plus size={18} />
            <span className="px-1">Add</span>
            Expense
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => !isPending && handleOpen(false)}
          />

          <div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10"
            style={{ animation: "modal-enter 240ms ease-out forwards" }}
          >
            <div className="transform rounded-3xl transition duration-300 ease-out scale-100 opacity-100">
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Add Expense
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Fill description, category, and amount to save an expense.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !isPending && handleOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer disabled:opacity-50"
                  disabled={isPending}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5 px-6 py-6">
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>
                  <input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    disabled={isPending}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Category
                    </label>
                    <input
                      id="category"
                      type="text"
                      value={category}
                      placeholder="Category"
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                      required
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-slate-700"
                    >
                      ₦ Amount
                    </label>
                    <input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                      required
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-200 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      handleOpen(false);
                    }}
                    className="inline-flex justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                    disabled={isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={() =>
                      sendGAEvent({
                        event: "button_clicked",
                        value: "added_expense",
                      })
                    }

                    className="inline-flex justify-center items-center gap-2 rounded-2xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary cursor-pointer disabled:opacity-75"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving Expense...
                      </>
                    ) : (
                      "Save Expense"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
