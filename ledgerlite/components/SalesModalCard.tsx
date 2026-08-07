"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import SalesForm from "@/components/salesform";

export default function SalesModalCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center h-full text-white bg-[#0B7A75] rounded-2xl px-4 py-5 md:py-12 hover:opacity-80 transition duration-150 w-full cursor-pointer"
      >
        <ShoppingBag className="space-y-2" size={15} />
        <span className="flex items-center gap-2 text-xs md:text-sm">
          <span className="hidden md:block">Add</span> Sales
        </span>
      </button>
      <SalesForm open={open} onOpenChange={setOpen} hideTrigger />
    </>
  );
}
