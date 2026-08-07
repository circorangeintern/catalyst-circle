"use client";

import { useOptimistic, useTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import ExpenseForm from "@/components/expenses/expenseform";
import ExpenseTable from "@/components/expenses/expense-table";
import ViewExpenseModal from "@/components/expenses/view-modal";
import EditExpenseModal from "@/components/expenses/edit-modal";
import DeleteExpenseModal from "@/components/expenses/delete-modal";
import { ShoppingBag, Search } from "lucide-react";
import SearchForm from "@/components/searchform";

interface ExpenseItem {
  id: string;
  description?: string | null;
  category: string;
  amount: any;
  createdAt: string | Date;
}

export default function ExpenseClient({
  moneyOutToday,
  totalMoneyOut,
  moneyOutYesterday,
  expenses,
}: {
  moneyOutToday: number;
  totalMoneyOut: number;
  moneyOutYesterday: number;
  expenses: ExpenseItem[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Modal display states
  const [viewExpense, setViewExpense] = useState<ExpenseItem | null>(null);
  const [editExpense, setEditExpense] = useState<ExpenseItem | null>(null);
  const [deleteExpense, setDeleteExpense] = useState<ExpenseItem | null>(null);

  // Operation loading trackers
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Direct optimistic setter (no reducer/action types used)
  const [optimisticExpenses, setOptimisticExpenses] = useOptimistic(
    expenses,
    (state, nextExpenses: ExpenseItem[]) => nextExpenses
  );

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const totalEntries = optimisticExpenses.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedExpenses = optimisticExpenses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    if (page > 1 && paginatedExpenses.length === 0) {
      setPage(page - 1);
    }
  }, [paginatedExpenses.length, page]);

  // Dispatch functions executed inside transitions
  async function handleAddExpense(data: { description: string; category: string; amount: number }) {
    const tempId = "temp-" + Math.random().toString(36).substring(2, 9);
    const tempExpense: ExpenseItem = {
      id: tempId,
      description: data.description,
      category: data.category,
      amount: data.amount,
      createdAt: new Date().toISOString(),
    };

    setOptimisticExpenses([tempExpense, ...optimisticExpenses]);

    const res = await fetch("api/routes/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      throw new Error(resData.message || "Failed to save expense");
    }
    router.refresh();
  }

  async function handleEditExpense(data: { description: string; category: string; amount: number }) {
    if (!editExpense) return;
    const id = editExpense.id;

    setEditingId(id);
    startTransition(async () => {
      try {
        const nextExpensesState = optimisticExpenses.map((item) =>
          item.id === id ? { ...item, ...data } : item
        );
        setOptimisticExpenses(nextExpensesState);

        const res = await fetch(`/api/routes/expenses/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const resData = await res.json();
        if (!res.ok || !resData.success) {
          throw new Error(resData.message || "Failed to update expense");
        }
        toast.success("Expense updated successfully!");
        setEditExpense(null);
        router.refresh();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to update expense");
      } finally {
        setEditingId(null);
      }
    });
  }

  async function handleDeleteConfirm() {
    if (!deleteExpense) return;
    const id = deleteExpense.id;

    setDeletingId(id);
    setDeleteExpense(null); // Close modal immediately

    startTransition(async () => {
      try {
        const nextExpensesState = optimisticExpenses.filter((item) => item.id !== id);
        setOptimisticExpenses(nextExpensesState);

        const res = await fetch(`/api/routes/expenses/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resData = await res.json();
        if (!res.ok || !resData.success) {
          throw new Error(resData.message || "Failed to delete expense");
        }
        toast.success("Expense deleted successfully!");
        router.refresh();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to delete expense");
      } finally {
        setDeletingId(null);
      }
    });
  }

  return (
    <div>
      <div>
        <div>
          <SideNav />
        </div>
        <div className="ml-0 md:ml-60 sm:ml-0">
          <UserNav />
        </div>
        <main className="ml-0 md:ml-62 sm:ml-10 p-6">
          <div className="border border-gray-300 my-5 shadow-sm p-6 rounded-4xl">
            <div>
              <h2 className="text-[#032523] text-2xl font-bold">Expense</h2>
              <p className="py-2 text-sm text-gray-700">
                Manage your Expenses to your dashboard and view it anytime
              </p>
            </div>

            <div className="md:flex justify-between items-center gap-10">
              <div className="relative w-full max-w-lg">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <SearchForm />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ExpenseForm onAddExpense={handleAddExpense} />
              </div>
            </div>
          </div>
          <div className="">
            <div className="grid gap-10 px-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="max-w-sm rounded-3xl border border-[#6DAFAC]  p-6 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <ShoppingBag size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500">
                  Total expense today
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">
                  ₦{totalMoneyOut.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Yesterday: ₦{moneyOutYesterday.toLocaleString()}
                </p>
              </div>
            </div>
            <aside className="rounded-4xl my-10 border border-[#6DAFAC] bg-white/95 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-slate-900">Expense history</h2>
              <p className="py-3 text-sm text-slate-600">
                Your Expense will appear here once they are saved.
              </p>
              {optimisticExpenses.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-primary/10 text-brand-primary">
                    <ShoppingBag size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    Expense records will appear below
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    When you save an expense, it will appear in this section for quick review.
                  </p>
                  <ExpenseForm />
                </div>
              ) : (
                <div className="py-5">
                  <ExpenseTable
                    expenses={paginatedExpenses}
                    onView={setViewExpense}
                    onEdit={setEditExpense}
                    onDelete={setDeleteExpense}
                    deletingId={deletingId}
                    page={page}
                    totalPages={totalPages}
                    totalEntries={totalEntries}
                    pageSize={pageSize}
                    onPageChange={setPage}
                  />

                  {/* Details Viewer Modal */}
                  {viewExpense && (
                    <ViewExpenseModal
                      expense={viewExpense}
                      onClose={() => setViewExpense(null)}
                    />
                  )}

                  {/* Form Editor Modal */}
                  {editExpense && (
                    <EditExpenseModal
                      expense={editExpense}
                      isOpen={true}
                      onClose={() => setEditExpense(null)}
                      onConfirm={handleEditExpense}
                      isPending={editingId === editExpense.id}
                    />
                  )}

                  {/* Warning Delete Confirmation Modal */}
                  {deleteExpense && (
                    <DeleteExpenseModal
                      expense={deleteExpense}
                      onClose={() => setDeleteExpense(null)}
                      onConfirm={handleDeleteConfirm}
                      isDeleting={deletingId === deleteExpense.id}
                    />
                  )}
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
