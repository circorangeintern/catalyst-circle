"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EllipsisVertical, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function Logout({
  user
}: { user?: any; }) {
  const User = user
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setConfirmOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  async function handleSignOut() {
    try {
      const response = await fetch("/api/protected/logout", {
        method: "POST",
      });
      const data = await response.json()
      if (response.ok && data?.message) {
        setConfirmOpen(false);
        setOpen(false);
        router.push("/signin");
        router.refresh();
        toast.success("signed out successfully.");
      } else {
        toast.error("Failed to sign out. Please try again.");
        //alert("Failed to sign out. Please try again.");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Network error: Could not complete sign out.");
      //alert(error || "Network error: Could not complete sign out.");
    }
  }
   

  return (
    <div>
      <div>
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex w-full items-center gap-2 rounded-full bg-teal-50 py-3.5 pl-5 text-sm font-semibold text-teal-700 transition-colors cursor-pointer hover:bg-teal-100"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
      <div className="relative inline-block text-left">
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/40"
              onClick={() => setConfirmOpen(false)}
            />
            <div className="relative bg-white rounded-lg shadow-lg w-full  max-w-sm mx-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 ">
                Confirm sign out
              </h3>
              <p className="mt-2 text-sm text-gray-600 ">
                Are you sure you want to sign out?
              </p>
              <div className="mt-4 flex gap-2 justify-end py-10">
                <button
                  className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm cursor-pointer"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm cursor-pointer"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
