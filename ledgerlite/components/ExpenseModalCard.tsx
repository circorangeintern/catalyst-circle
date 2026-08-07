"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import ExpenseForm from "@/components/expenses/expenseform";

export default function ExpenseModalCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center h-full text-white bg-[#0B7A75] rounded-2xl px-4 py-5 md:py-12 hover:opacity-80 transition duration-150 w-full cursor-pointer"
      >
        <Receipt size={15} />
        <span className="flex items-center gap-2 text-xs md:text-sm">
          <span className="hidden md:block">Add</span> Expense
        </span>
      </button>
      <ExpenseForm open={open} onOpenChange={setOpen} hideTrigger />
    </>
  );
}
