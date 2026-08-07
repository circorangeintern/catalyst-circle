"use client";

import React, { useState, useRef } from "react";
import { Search, ChevronDown, Camera, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

type ProfileSection = "personal" | "business";

const NAV_ITEMS: {
  id: ProfileSection;
  label: string;
}[] = [
  { id: "personal", label: "Personal Profile" },
  { id: "business", label: "Business Profile" },
];

const BUSINESS_TYPES = [
  "Retail / Shop",
  "Restaurant / Food Vendor",
  "Fashion & Apparel",
  "Grocery / Market Stall",
  "Services",
  "Wholesale / Distribution",
  "Other",
];

interface SidebarProps {
  active: ProfileSection;
  onSelect: (s: ProfileSection) => void;
}

function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="w-full border-b border-slate-100 bg-white px-4 py-4 sm:px-6 lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <h2 className="mb-4 text-xl font-bold text-slate-900 lg:mb-6">Profile</h2>
      <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:pb-0">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`relative flex min-w-fit items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors cursor-pointer lg:w-full ${
                isActive
                  ? "font-medium text-teal-700 bg-teal-50/40"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {isActive && (
                <span className="absolute -left-4 top-1/2 hidden h-6 w-0.5 -translate-y-1/2 rounded-r bg-teal-600 lg:block" />
              )}
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mb-6 text-xl font-bold text-slate-900 sm:mb-8 sm:text-2xl">
      {children}
    </h1>
  );
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mb-5 w-full max-w-full sm:mb-6 sm:max-w-lg">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
          disabled
            ? "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
            : "border-slate-200 bg-white text-slate-800 focus:border-teal-500 placeholder:text-slate-400"
        }`}
      />
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="mb-6 flex w-full max-w-full items-center justify-between gap-3 sm:mb-8 sm:max-w-lg">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors cursor-pointer ${
          checked ? "bg-teal-600" : "bg-slate-200"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "-translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ---------------- Sections ---------------- */

interface PersonalSectionProps {
  initialName: string;
  initialEmail: string;
  initialImage: string;
  onSave: (payload: { name: string; image: string }) => Promise<void>;
  loading: boolean;
}

function PersonalProfileSection({
  initialName,
  initialEmail,
  initialImage,
  onSave,
  loading,
}: PersonalSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fullName, setFullName] = useState(initialName);
  const [image, setImage] = useState(initialImage);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("Profile picture must be smaller than 1.5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    await onSave({ name: fullName, image });
  };

  return (
    <div>
      <SectionHeading>Personal Profile</SectionHeading>

      {/* Avatar Selection */}
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start mb-8">
        <div className="relative group h-28 w-28 overflow-hidden rounded-full border-2 border-teal-600 bg-slate-50 flex items-center justify-center shadow-md">
          {image ? (
            <Image
              src={image}
              alt="User avatar"
              width={112}
              height={112}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full rounded-full bg-linear-to-br from-teal-500 to-teal-700 flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 cursor-pointer disabled:opacity-0"
            title="Change profile picture"
          >
            <Camera size={20} />
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">
              Upload
            </span>
          </button>
        </div>

        <div className="text-center sm:text-left">
          <h3 className="text-sm font-semibold text-slate-800">
            Profile Picture
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-xs">
            Supports JPEG, PNG or WEBP formats. Max size 1.5MB.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer disabled:opacity-50"
          >
            <Camera size={12} />
            Choose File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
        </div>
      </div>

      <TextField
        label="Full Name"
        placeholder="eg. John Doe"
        value={fullName}
        onChange={setFullName}
        disabled={loading}
      />

      <TextField
        label="Email"
        placeholder="eg. you@mail.com"
        type="email"
        value={initialEmail}
        disabled={true}
      />

      <div className="max-w-full space-y-3 sm:max-w-lg pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}

interface BusinessSectionProps {
  initialBuisnessName: string;
  onSave: (payload: { buisnessName: string }) => Promise<void>;
  loading: boolean;
}

function BusinessProfileSection({
  initialBuisnessName,
  onSave,
  loading,
}: BusinessSectionProps) {
  const [businessName, setBusinessName] = useState(initialBuisnessName);
  const [businessType, setBusinessType] = useState("Services");
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeQuery, setTypeQuery] = useState("");
  const [inventoryEnabled, setInventoryEnabled] = useState(true);

  const filteredTypes = BUSINESS_TYPES.filter((t) =>
    t.toLowerCase().includes(typeQuery.toLowerCase())
  );

  const handleSave = async () => {
    if (!businessName.trim()) {
      toast.error("Business name is required");
      return;
    }
    await onSave({ buisnessName: businessName });
  };

  return (
    <div>
      <SectionHeading>Business Profile</SectionHeading>

      <TextField
        label="Business Name"
        placeholder="eg. LedgerLite"
        value={businessName}
        onChange={setBusinessName}
        disabled={loading}
      />

      <div className="relative mb-6 max-w-full sm:mb-8 sm:max-w-lg">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Business Type
        </label>
        <button
          type="button"
          onClick={() => setTypeOpen((o) => !o)}
          disabled={loading}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 cursor-pointer"
        >
          <span
            className={`flex-1 text-sm ${
              businessType ? "text-slate-800" : "text-slate-400"
            }`}
          >
            {businessType || "Select Business Type"}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
              typeOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {typeOpen && (
          <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="border-b border-slate-100 p-2">
              <input
                autoFocus
                value={typeQuery}
                onChange={(e) => setTypeQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none"
              />
            </div>
            <ul className="max-h-48 overflow-y-auto py-1">
              {filteredTypes.length === 0 && (
                <li className="px-4 py-2 text-sm text-slate-400">No matches</li>
              )}
              {filteredTypes.map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => {
                      setBusinessType(t);
                      setTypeOpen(false);
                      setTypeQuery("");
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ToggleRow
        label="Enable Inventory"
        checked={inventoryEnabled}
        onChange={setInventoryEnabled}
      />

      <div className="max-w-full space-y-3 sm:max-w-lg pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Root ---------------- */

interface LedgerLiteProfileProps {
  initialName: string;
  initialEmail: string;
  initialBuisnessName: string;
  initialImage: string;
  createdAt: string;
}

export default function LedgerLiteProfile({
  initialName,
  initialEmail,
  initialBuisnessName,
  initialImage,
}: LedgerLiteProfileProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ProfileSection>("personal");
  const [loading, setLoading] = useState(false);

  // Handle profile update submits
  const handleProfileSave = async (payload: { name?: string; buisnessName?: string; image?: string }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/protected/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Profile updated successfully!");

        // Dispatch dynamic avatar update event
        if (payload.image) {
          const event = new CustomEvent("profile-avatar-update", { detail: payload.image });
          window.dispatchEvent(event);
        }

        // Add custom profile update notification to client storage list
        try {
          const customNotifs = JSON.parse(localStorage.getItem("ledgerlite-custom-notifications") || "[]");
          let message = "Your profile information was updated successfully.";
          if (payload.buisnessName && payload.name) {
            message = `Full name updated to "${payload.name}" and business name updated to "${payload.buisnessName}".`;
          } else if (payload.buisnessName) {
            message = `Business name updated to "${payload.buisnessName}".`;
          } else if (payload.name) {
            message = `Full name updated to "${payload.name}".`;
          } else if (payload.image) {
            message = "Profile avatar updated successfully.";
          }
          
          customNotifs.unshift({
            id: `profile-update-${Date.now()}`,
            kind: "profile-update",
            title: "Profile Updated",
            message,
            timestamp: new Date().toISOString(),
            read: false
          });
          localStorage.setItem("ledgerlite-custom-notifications", JSON.stringify(customNotifs.slice(0, 10)));
          
          // Dispatch custom event to notify other components (e.g. UserNav or appnotifications)
          window.dispatchEvent(new CustomEvent("ledgerlite-notification-new"));
        } catch (e) {
          console.error("Error writing notification", e);
        }

        router.refresh();
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error: Could not save profile changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-125">
        <Sidebar active={activeSection} onSelect={setActiveSection} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10 bg-white">
          {activeSection === "personal" && (
            <PersonalProfileSection
              initialName={initialName}
              initialEmail={initialEmail}
              initialImage={initialImage}
              onSave={handleProfileSave}
              loading={loading}
            />
          )}
          {activeSection === "business" && (
            <BusinessProfileSection
              initialBuisnessName={initialBuisnessName}
              onSave={handleProfileSave}
              loading={loading}
            />
          )}
        </main>
      </div>
    </div>
  );
}
