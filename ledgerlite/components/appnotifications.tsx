"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@/app/lib/useLocalStorage";
import {
  ChevronLeft,
  AlertTriangle,
  FileDown,
  PackageCheck,
  Inbox,
  Download,
  Loader2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type NotificationKind = "low-stock" | "export-ready" | "restock" | "profile-update";

interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  meta?: {
    fileSize?: string;
  };
}

const KIND_STYLES: Record<
  NotificationKind,
  { icon: React.ReactNode; card: string }
> = {
  "low-stock": {
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    card: "border-red-200 bg-red-50/60",
  },
  "export-ready": {
    icon: <FileDown className="h-5 w-5 text-teal-600" />,
    card: "border-slate-200 bg-white",
  },
  restock: {
    icon: <PackageCheck className="h-5 w-5 text-teal-600" />,
    card: "border-slate-200 bg-white",
  },
  "profile-update": {
    icon: <User className="h-5 w-5 text-teal-600" />,
    card: "border-slate-200 bg-white",
  },
};

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <Inbox className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">No notifications</h3>
      <p className="mt-1 text-sm text-slate-400">
        Important updates and alerts will appear here
      </p>
    </div>
  );
}

function NotificationCard({
  notification,
  onRestock,
  onDownload,
}: {
  notification: AppNotification;
  onRestock?: (id: string) => void;
  onDownload?: (id: string) => void;
}) {
  const style = KIND_STYLES[notification.kind];

  return (
    <div className={`rounded-2xl border px-5 py-4 transition-all duration-200 ${style.card} ${notification.read ? "opacity-60" : "opacity-100 ring-1 ring-teal-500/5 shadow-sm"
      }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0">{style.icon}</span>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              {notification.title}
              {!notification.read && (
                <span className="h-2 w-2 rounded-full bg-teal-500 shrink-0" title="Unread" />
              )}
            </h4>
            <p className="mt-1 py-3 text-sm leading-relaxed text-slate-500">
              {notification.message}
            </p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap text-xs font-medium uppercase tracking-wide text-slate-400">
          {notification.timestamp}
        </span>
      </div>

      {notification.kind === "low-stock" && (
        <Link
          href="/inventory"
          onClick={() => onRestock?.(notification.id)}
          className="ml-8 mt-4 inline-block rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer"
        >
          Restock
        </Link>
      )}

      {notification.kind === "export-ready" && (
        <button
          onClick={() => onDownload?.(notification.id)}
          className="ml-8 mt-4 flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:underline cursor-pointer"
        >
          <Download className="h-4 w-4" />
          Download PDF{" "}
          {notification.meta?.fileSize && `(${notification.meta.fileSize})`}
        </button>
      )}
    </div>
  );
}

function BackIconButton() {
  const router = useRouter();

  const handleBack = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    router.back();
  };

  return (
    <button
      className="bg-[#F4F8F8] p-2 md:p-3 rounded-full text-teal-700 cursor-pointer"
      type="button"
      onClick={handleBack}
      aria-label="Go back"
    >
      <ChevronLeft className="h-7 w-7" />
    </button>
  );
}

function getClientRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "Just now";

    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  } catch (e) {
    return dateString;
  }
}

export default function LedgerLiteNotifications() {
  const [readIds, setReadIds] = useLocalStorage<string[]>(
    "ledgerlite-read-notifications",
    []
  );
  const [lowStockAlertsEnabled] = useLocalStorage<boolean>(
    "ledgerlite-alert-low-stock",
    true
  );

  // Fetch dynamic notification items from endpoints using React Query
  const { data, isPending, error, refetch } = useQuery<{
    notifications: AppNotification[];
  }>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/protected/notifications");
      if (!res.ok) {
        throw new Error("Failed to load notifications");
      }
      return res.json();
    },
  });

  // Listen to profile update changes and update list in real-time
  React.useEffect(() => {
    const handleUpdate = () => {
      refetch();
    };
    window.addEventListener("ledgerlite-notification-new", handleUpdate);
    return () => {
      window.removeEventListener("ledgerlite-notification-new", handleUpdate);
    };
  }, [refetch]);

  const rawNotifications = data?.notifications ?? [];

  // Load custom profile update notifications from localStorage
  const [customNotifs] = useLocalStorage<AppNotification[]>(
    "ledgerlite-custom-notifications",
    []
  );

  const combinedNotifications = [...customNotifs, ...rawNotifications];

  // Filter out low stock alerts if notification settings are turned off
  const filteredNotifications = combinedNotifications.filter((n) => {
    if (n.kind === "low-stock" && !lowStockAlertsEnabled) {
      return false;
    }
    return true;
  });

  // Calculate dynamic read states from LocalStorage syncing
  const processedNotifications = filteredNotifications.map((n) => {
    const isIso = n.timestamp.includes("-") && n.timestamp.includes("T");
    return {
      ...n,
      timestamp: isIso ? getClientRelativeTime(n.timestamp) : n.timestamp,
      read: n.read || readIds.includes(n.id),
    };
  });

  const markAllAsRead = () => {
    const allIds = processedNotifications.map((n) => n.id);
    setReadIds((prev) => Array.from(new Set([...prev, ...allIds])));
  };

  const handleRestock = (id: string) => {
    setReadIds((prev) => Array.from(new Set([...prev, id])));
  };

  const handleDownload = (id: string) => {
    setReadIds((prev) => Array.from(new Set([...prev, id])));
  };

  const hasUnread = processedNotifications.some((n) => !n.read);

  return (
    <div className="mx-auto flex min-h-150 w-full max-w-3xl flex-col rounded-2xl bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3 text-lg font-bold text-slate-900">
          <BackIconButton />
          Notifications
        </div>

        {processedNotifications.length > 0 && hasUnread && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-teal-600 hover:underline cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col px-6 py-6">
        {isPending ? (
          <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
            <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
            <p className="mt-2 text-sm text-slate-500">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-600 shadow-sm text-center">
            Failed to load notifications. Please reload the page.
          </div>
        ) : processedNotifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {processedNotifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onRestock={handleRestock}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
