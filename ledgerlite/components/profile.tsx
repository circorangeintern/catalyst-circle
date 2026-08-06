"use client";
import React from "react";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

/**
 * LedgerLite - Profile Module
 * Sidebar sections: Personal Profile, Business Profile
 */

type ProfileSection = "personal" | "business";

const NAV_ITEMS: {
  id: ProfileSection;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "personal",
    label: "Personal Profile",
    icon: null,
  },
  {
    id: "business",
    label: "Business Profile",
    icon: null,
  },
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

function Sidebar({
  active,
  onSelect,
}: {
  active: ProfileSection;
  onSelect: (s: ProfileSection) => void;
}) {
  return (
    <aside className="w-full border-b border-slate-100 bg-white px-4 py-4 sm:px-6 lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <h2 className="mb-4 text-xl font-bold text-slate-900 lg:mb-6">Profile</h2>
      <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:pb-0">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`relative flex min-w-fit items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors cursor-pointer lg:w-full ${
                isActive
                  ? "font-medium text-teal-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {isActive && (
                <span className="absolute -left-4 top-1/2 hidden h-6 w-0.5 -translate-y-1/2 rounded-r bg-teal-600 lg:block" />
              )}
              <span className={isActive ? "text-teal-600" : "text-slate-400"}>
                {item.icon}
              </span>
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
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="mb-5 w-full max-w-full sm:mb-6 sm:max-w-lg">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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

function PersonalProfileSection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div>
      {/* <ProfileClient
        initialName={initialName}
        initialEmail={initialEmail}
        initialBuisnessName={initialBuisnessName}
        initialImage={initialImage}
        createdAt={createdAt}
      /> */}
      <SectionHeading>Personal Profile</SectionHeading>
      <TextField
        label="Full Name"
        placeholder="eg. John Doe"
        value={fullName}
        onChange={setFullName}
      />
      <TextField
        label="Email"
        placeholder="eg. you@mail.com"
        type="email"
        value={email}
        onChange={setEmail}
      />
      <div className="max-w-full space-y-3 sm:max-w-lg">
        <button className="w-full rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer">
          Save Changes
        </button>
        <button className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:opacity-80 cursor-pointer ">
          Cancel
        </button>
      </div>
    </div>
  );
}

function BusinessProfileSection() {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeQuery, setTypeQuery] = useState("");
  const [inventoryEnabled, setInventoryEnabled] = useState(true);

  const filteredTypes = BUSINESS_TYPES.filter((t) =>
    t.toLowerCase().includes(typeQuery.toLowerCase()),
  );

  return (
    <div>
      <SectionHeading>Business Profile</SectionHeading>

      <TextField
        label="Business Name"
        placeholder="eg. LedgerLite"
        value={businessName}
        onChange={setBusinessName}
      />

      <div className="relative mb-6 max-w-full sm:mb-8 sm:max-w-lg">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Business Type
        </label>
        <button
          type="button"
          onClick={() => setTypeOpen((o) => !o)}
          className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <span
            className={`flex-1 text-sm ${businessType ? "text-slate-800" : "text-slate-400"}`}
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

      <div className="max-w-full space-y-3 sm:max-w-lg">
        <button className="w-full rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer">
          Save Changes
        </button>
        <button className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50 cursor-pointer hover:opacity-80">
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ---------------- Root ---------------- */

export default function LedgerLiteProfile() {
  const [activeSection, setActiveSection] =
    useState<ProfileSection>("personal");

  return (
    <div className=" w-full bg-white">
      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
        <Sidebar active={activeSection} onSelect={setActiveSection} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {activeSection === "personal" && <PersonalProfileSection />}
          {activeSection === "business" && <BusinessProfileSection />}
        </main>
      </div>
    </div>
  );
}
