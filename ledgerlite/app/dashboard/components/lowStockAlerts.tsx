"use client";
import React, { useState } from "react";
import Link from "next/link";
import InventoryForm from "@/components/inventoryform";
import { Package, Plus } from "lucide-react";

interface LowStockAlertsProps {
  lowstock: any[];
  count: number;
}

export default function LowStockAlerts({
  lowstock = [],
  count = 0,
}: LowStockAlertsProps) {
  const [showInventoryForm, setShowInventoryForm] = useState(false);

  return (
    <div className="border flex flex-col shadow-sm border-gray-200 rounded-2xl lg:px-5 md:py-5 my-5 bg-white w-full md:max-w-md">
      <div className="flex justify-between py-4 px-6 border-b border-gray-50">
        <h4 className="text-sm font-semibold text-slate-800">Low stock</h4>
        <div className="flex items-center px-2 bg-red-100 rounded-xl">
          <p className="items-center text-sm text-red-700">
            {count} {lowstock.length <= 1 ? "Alert" : "Alerts"}
          </p>
        </div>
      </div>
      {Array.isArray(lowstock) && lowstock.length !== 0 ? (
        lowstock.map((item: any) => (
          <div
            key={item.id}
            className="flex justify-between gap-5 py-4 px-6 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <Package size={15} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {item.currentStock} units left . Min {item.lowStock}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href={`/inventory?search=${encodeURIComponent(item.name)}`}
                className="text-[#0B7A75] hover:opacity-85"
              >
                <Plus size={18} />
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="mx-auto w-full max-w-sm rounded-3x rounded-2xl   px-4  text-center">
          <div className="my-2 flex justify-center">
            <Package
              className="md:h-10 md:w-10 h-7 w-7 text-slate-800"
              strokeWidth={1.5}
            />
          </div>

          <p className=" text-xs md:text-md font-semibold text-slate-900">
            You are fully stocked
          </p>
          <p className="text-xs md:text-sm text-slate-500">
            No item needs restocking right now
          </p>

          <button
            onClick={() => setShowInventoryForm(true)}
            className="my-3 w-full rounded-full border border-slate-300 py-3 text-xs md:text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            View Inventory
          </button>
          <InventoryForm
            open={showInventoryForm}
            onOpenChange={setShowInventoryForm}
            hideTrigger
          />
        </div>
      )}
    </div>
  );
}
