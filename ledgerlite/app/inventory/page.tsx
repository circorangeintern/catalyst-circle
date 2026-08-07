"use client";

import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import InventoryForm from "@/components/inventoryform";
import InventoryCard from "@/components/inventorycard";
import InventoryDisplay from "@/components/inventorydisplay";

import { Package, Search, TriangleAlert, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/routes/item");
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.allProducts || []);
      } else {
        if (res.status === 404) {
          setItems([]);
        } else {
          setError(data.message || "Failed to load products.");
        }
      }
    } catch (err: any) {
      setError("Network error: Could not fetch products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = items.filter((item) => item.currentStock <= item.lowStock);

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
              <h2 className="text-[#032523] text-2xl font-bold">Inventory</h2>
              <p className="py-2 text-sm text-gray-700">
                Manage your Inventory in your dashboard and view it anytime
              </p>
            </div>

            <div className="md:flex justify-between items-center gap-10">
              <div className="relative w-full max-w-lg ">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="search"
                  defaultValue={search}
                  onChange={(e) => debouncedSearch(e.target.value)}
                  placeholder="Search item"
                  className="w-full rounded-3xl border border-slate-200 bg-white px-12 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-[#6DAFAC]/6 "
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <InventoryForm onSaveSuccess={fetchItems} />
              </div>
            </div>
          </div>

          <div>
            <div>
              <div className="flex flex-col max-w-sm rounded-3xl border border-[#6DAFAC] p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-brand-primary">
                    <TriangleAlert className="text-red-500" size={20} />
                  </div>
                  <p className="text-sm font-semibold text-slate-950">Low stock alert</p>
                </div>
                <p className={`mt-3 text-lg font-semibold ${lowStockItems.length > 0 ? "text-red-600" : "text-slate-900"}`}>
                  {lowStockItems.length > 0
                    ? `${lowStockItems.length} Low Stock Alert${lowStockItems.length > 1 ? "s" : ""}`
                    : "No low stocks"}
                </p>
                <span>
                  <InventoryDisplay lowStockItems={lowStockItems} />
                </span>
              </div>
            </div>

            <aside className="rounded-4xl my-10 border border-[#6DAFAC] bg-white/95 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-slate-900">
                Inventory history
              </h2>
              <p className="py-3 text-sm text-slate-600">
                Your Inventory will appear here once they are saved.
              </p>
              
              {loading ? (
                <div className="space-y-4 animate-pulse py-5">
                  <div className="grid grid-cols-6 gap-4 bg-slate-50 p-4 rounded-t-2xl border-b border-slate-100">
                    <div className="h-4 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                  </div>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="grid grid-cols-6 gap-4 p-4 items-center border-b border-slate-100">
                      <div className="h-5 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-6 bg-slate-200 rounded w-12"></div>
                      <div className="h-4 bg-slate-200 rounded w-8"></div>
                      <div className="h-4 bg-slate-200 rounded w-20"></div>
                      <div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div>
                      <div className="h-5 bg-slate-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm">
                  {error}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-primary/10 text-brand-primary">
                    <Package size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    Inventory records will appear below
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    When you save an inventory, it will appear in this section for quick review.
                  </p>
                  <div>
                    <InventoryForm onSaveSuccess={fetchItems} />
                  </div>
                </div>
              ) : (
                <div className="py-5">
                  <InventoryCard items={filteredItems} onRefresh={fetchItems} />
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
