"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import InventoryForm from "@/components/inventoryform";

export default function InventoryModalCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center h-full text-white bg-[#0B7A75] rounded-2xl px-4 py-5 md:py-12 hover:opacity-80 transition duration-150 w-full cursor-pointer"
      >
        <Package size={15} />
        <span className="flex items-center gap-2 text-xs md:text-sm">
          <span className="hidden md:block">Add</span> Inventory
        </span>
      </button>
      <InventoryForm open={open} onOpenChange={setOpen} hideTrigger />
    </>
  );
}
