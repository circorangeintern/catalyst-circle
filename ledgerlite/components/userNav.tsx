"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Bell, User } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@/app/lib/useLocalStorage";

type NotificationKind = "low-stock" | "export-ready" | "restock" | "profile-update";

interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function UserNav({
  name = "",
  buisnessName = "",
}: {
  name?: string;
  buisnessName?: string;
}) {
  const [userName, setUserName] = useState(name);
  const [bizName, setBizName] = useState(buisnessName);
  const [profile, setProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState("");

  const [readIds] = useLocalStorage<string[]>(
    "ledgerlite-read-notifications",
    []
  );
  const [lowStockAlertsEnabled] = useLocalStorage<boolean>(
    "ledgerlite-alert-low-stock",
    true
  );
  const [customNotifs] = useLocalStorage<AppNotification[]>(
    "ledgerlite-custom-notifications",
    []
  );

  // Fetch dynamic notifications list to compute unread count badge
  const { data, refetch } = useQuery<{ notifications: AppNotification[] }>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/protected/notifications");
      if (!res.ok) {
        throw new Error("Failed to load notifications");
      }
      return res.json();
    },
    refetchInterval: 30000, // Check for updates every 30 seconds
  });

  // Dynamically refetch when custom profile update events occur
  useEffect(() => {
    const handleUpdate = () => {
      refetch();
    };
    window.addEventListener("ledgerlite-notification-new", handleUpdate);
    return () => {
      window.removeEventListener("ledgerlite-notification-new", handleUpdate);
    };
  }, [refetch]);

  const rawNotifications = data?.notifications ?? [];

  // Filter based on user preferences in Settings
  const filteredNotifications = [...customNotifs, ...rawNotifications].filter((n) => {
    if (n.kind === "low-stock" && !lowStockAlertsEnabled) {
      return false;
    }
    return true;
  });

  // Calculate unread count (exclude locally read notification IDs)
  const unreadCount = filteredNotifications.filter(
    (n) => !n.read && !readIds.includes(n.id)
  ).length;

  useEffect(() => {
    // Sync state if props change
    if (name) setUserName(name);
    if (buisnessName) setBizName(buisnessName);

    // Fetch user profile dynamically to get the email, image, and complete info
    fetch("/api/protected/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfile(data.profile);
          if (data.profile.image) setAvatar(data.profile.image);
          if (!name) setUserName(data.profile.name || "");
          if (!buisnessName) setBizName(data.profile.buisnessName || "");
        }
      })
      .catch((err) => console.error("Error fetching UserNav profile:", err));
  }, [name, buisnessName]);

  // Listen to profile photo changes dynamically from other pages without reloading
  useEffect(() => {
    function handleAvatarChange(e: Event) {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail === "string") {
        setAvatar(customEvent.detail);
      }
    }
    window.addEventListener("profile-avatar-update", handleAvatarChange);
    return () => {
      window.removeEventListener("profile-avatar-update", handleAvatarChange);
    };
  }, []);

  return (
    <div>
      <section>
        {/* userNav user navigation profile details */}
        <div className=" w-full border-b border-gray-100 ">
          {/* user profile */}
          <div className="p-2">
            <div className="flex justify-between items-center px-4 py-2">
              <div className="relative">
                <span className="hidden md:block">Dashboard</span>
              </div>

              <div className="flex items-end gap-2">
                <div className="bg-gray-100 p-2 rounded-full relative">
                  <Link href="/notifications">
                    <Bell className="h-6 w-6 text-brand-primary " />
                  </Link>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="w-1"></div>
                <div className="flex flex-col">
                  {/* business name */}
                  <span className="hidden md:block text-sm font-medium text-gray-900">
                    {bizName}
                  </span>
                  {/* username */}
                  <span className="hidden md:block text-xs text-gray-500">
                    {userName}
                  </span>
                </div>
                {/* Profile Image Display */}

{/* 
                {avatar ? (
                  <div className="w-10 h-10  rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                    <Image
                      className="rounded-full object-cover w-10 h-10"
                      src={avatar}
                      alt="profile-photo"
                      width={40}
                      height={40}
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className=" rounded-full bg-linear-to-br from-teal-500 to-teal-700 flex items-center justify-center w-10 h-10">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
======= */}
                <div className="hidden md:block">
                  {avatar ? (
                    <div className="w-10 h-10  rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                      <Image
                        className="rounded-full object-cover w-10 h-10"
                        src={avatar}
                        alt="profile-photo"
                        width={40}
                        height={40}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className=" rounded-full bg-linear-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                      <User className="w-10 h-10  text-white" />
                    </div>
                  )}
                </div>
{/* >>>>>>> a6eb87c7be8db0d543ddc030ef63b265d7dfa309 */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
