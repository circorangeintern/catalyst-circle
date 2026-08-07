"use client";

import Logout from "@/components/logout";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "@/app/lib/useTheme";
import { useLocalStorage } from "@/app/lib/useLocalStorage";
import { validatePassword, validateFeedback } from "@/app/lib/settingsUtils";
import {
  Bell,
  Shield,
  Palette,
  MessageSquare,
  Trash2,
  X,
  CircleUserRound,
  Loader2,
} from "lucide-react";

type SettingsSection =
  "security" | "theme" | "notifications" | "feedback" | "account";

const NAV_ITEMS: {
  id: SettingsSection;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "security", label: "Security", icon: null},
  { id: "theme", label: "Theme", icon: null },
  {
    id: "notifications",
    label: "Notifications",
    icon: null
  },
  {
    id: "feedback",
    label: "Feedback & Support",
    icon: null
  },
  {
    id: "account",
    label: "Account Action",
    icon: null
  },
];

function Sidebar({
  active,
  onSelect,
}: {
  active: SettingsSection;
  onSelect: (s: SettingsSection) => void;
}) {
  return (
    <aside className="w-full border-b border-slate-100 bg-white px-4 py-4 sm:px-5 lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <h2 className="mb-4 text-xl font-bold text-slate-900 lg:mb-6">
        Settings
      </h2>
      <nav className="-mx-1 flex gap-2 overflow-x-auto pb-1 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`relative flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors lg:w-full ${
                isActive
                  ? "font-medium text-teal-700 bg-teal-50/50"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {isActive && (
                <span className="absolute -left-1 top-1/2 hidden h-6 w-0.5 -translate-y-1/2 rounded-r bg-teal-600 lg:block" />
              )}
              <span className={isActive ? "text-teal-600" : "text-slate-400"}>
                {item.icon}
              </span>
              <span className="cursor-pointer whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl lg:mb-8">
      {children}
    </h1>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  error,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mb-6 w-full max-w-lg">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your password"
        aria-invalid={Boolean(error)}
        disabled={disabled}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
            : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
        } disabled:opacity-60 disabled:cursor-not-allowed`}
      />
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

/* ---------------- Sections ---------------- */

function SecuritySection() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);

  const oldPasswordError =
    submitAttempted && !oldPassword.trim()
      ? "Current password is required."
      : "";
  const newPasswordError = submitAttempted ? validatePassword(newPassword) : "";
  const confirmPasswordError = submitAttempted
    ? !confirmPassword.trim()
      ? "Please confirm your new password."
      : confirmPassword !== newPassword
        ? "Passwords do not match."
        : ""
    : "";

  const isFormValid =
    oldPassword.trim() &&
    !validatePassword(newPassword) &&
    confirmPassword.trim() &&
    confirmPassword === newPassword;

  const handleSave = async () => {
    setSubmitAttempted(true);

    if (!isFormValid) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/protected/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        toast.success("Security credentials updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSubmitAttempted(false);
      } else {
        toast.error(result.error || "Failed to update security credentials.");
      }
    } catch (err) {
      toast.error("Network error: Could not save password changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeading>Security</SectionHeading>
      <PasswordField
        label="Old Password"
        value={oldPassword}
        onChange={setOldPassword}
        error={oldPasswordError}
        disabled={loading}
      />
      <PasswordField
        label="New Password"
        value={newPassword}
        onChange={setNewPassword}
        error={newPasswordError}
        disabled={loading}
      />
      <PasswordField
        label="Confirm Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={confirmPasswordError}
        disabled={loading}
      />
      <div className="w-full max-w-lg space-y-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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
        <button
          disabled={loading}
          onClick={() => {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setSubmitAttempted(false);
          }}
          className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50 cursor-pointer disabled:opacity-55"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function RadioRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex w-full max-w-lg items-center justify-between gap-4 border-b border-slate-100 py-5 text-left"
    >
      <span className="text-sm text-slate-800">{label}</span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 cursor-pointer ${
          selected ? "border-teal-600" : "border-slate-300"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />}
      </span>
    </button>
  );
}

function ThemeSection() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <SectionHeading>Theme</SectionHeading>
      <div className="max-w-lg">
        <RadioRow
          label="Light Mode"
          selected={theme === "light"}
          onSelect={() => setTheme("light")}
        />
        <RadioRow
          label="Dark Mode"
          selected={theme === "dark"}
          onSelect={() => setTheme("dark")}
        />
        <RadioRow
          label="System Default"
          selected={theme === "system"}
          onSelect={() => setTheme("system")}
        />
      </div>
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
    <div className="flex w-full max-w-lg items-center justify-between gap-4 py-3">
      <span className="text-sm text-slate-800">{label}</span>
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

function NotificationsSection() {
  const [lowStockAlert, setLowStockAlert] = useLocalStorage(
    "ledgerlite-alert-low-stock",
    true,
  );

  const handleAlertChange = (checked: boolean) => {
    setLowStockAlert(checked);
    toast.success(
      checked ? "Low stock alerts enabled!" : "Low stock alerts muted.",
    );
  };

  return (
    <div>
      <SectionHeading>Notifications</SectionHeading>
      <ToggleRow
        label="Low Stock Alert"
        checked={lowStockAlert}
        onChange={handleAlertChange}
      />
    </div>
  );
}

function FeedbackSection() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { subjectError, messageError } = validateFeedback(subject, message);
  const showSubjectError = submitAttempted && subjectError;
  const showMessageError = submitAttempted && messageError;
  const isFormValid = !subjectError && !messageError;

  const handleSend = async () => {
    setSubmitAttempted(true);

    if (!isFormValid) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/protected/settings/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        toast.success("Feedback submitted successfully! Thank you.");
        setSubject("");
        setMessage("");
        setSubmitAttempted(false);
      } else {
        toast.error(result.error || "Failed to submit feedback.");
      }
    } catch (err) {
      toast.error("Network error: Could not submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeading>Feedback &amp; Support</SectionHeading>
      <div className="max-w-lg">
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Subject
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={loading}
            aria-invalid={Boolean(showSubjectError)}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 transition-colors focus:outline-none focus:ring-2 ${
              showSubjectError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
            } disabled:opacity-60`}
          />
          {showSubjectError ? (
            <p className="mt-1.5 text-xs text-red-600">{subjectError}</p>
          ) : null}
        </div>
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            rows={7}
            aria-invalid={Boolean(showMessageError)}
            className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 transition-colors focus:outline-none focus:ring-2 ${
              showMessageError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
            } disabled:opacity-60`}
          />
          {showMessageError ? (
            <p className="mt-1.5 text-xs text-red-600">{messageError}</p>
          ) : null}
        </div>
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 disabled:opacity-75 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending Feedback...
            </>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
}

function AccountActionSection({
  onDeleteAccount,
}: {
  onDeleteAccount: () => void;
}) {
  return (
    <div>
      <SectionHeading>Account Action</SectionHeading>
      <div className="w-full max-w-lg space-y-3">
        <div className="w-full">
          <Logout />
        </div>
        <button
          onClick={onDeleteAccount}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-red-600 py-3.5 px-4 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition-colors hover:bg-red-700 cursor-pointer sm:justify-start sm:pl-5"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}

/* ---------------- Modals ---------------- */

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-3 py-4 sm:px-4">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-7">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer sm:right-5 sm:top-5"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function ConfirmPasswordModal({
  onCancel,
  onContinue,
}: {
  onCancel: () => void;
  onContinue: (password: string) => void;
}) {
  const [password, setPassword] = useState("");

  return (
    <ModalShell onClose={onCancel}>
      <h3 className="text-xl font-bold text-slate-900">
        Confirm your password
      </h3>
      <p className="mt-1.5 text-sm text-slate-500">
        For your security, please enter your password to continue
      </p>

      <div className="mt-6 mb-8">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onContinue(password)}
          disabled={!password}
          className="w-full rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
        >
          Continue
        </button>
        <button
          onClick={onCancel}
          className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </ModalShell>
  );
}

function DeleteAccountModal({
  onCancel,
  onDelete,
  isPending,
}: {
  onCancel: () => void;
  onDelete: () => void;
  isPending?: boolean;
}) {
  return (
    <ModalShell onClose={onCancel}>
      <h3 className="text-xl font-bold text-slate-900">Delete Account?</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        This action will permanently delete your account, business information,
        sales, expenses, and inventory records. This action cannot be undone.
      </p>

      <div className="mt-8 space-y-3">
        <button
          onClick={onCancel}
          disabled={isPending}
          className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50 cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-red-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition-colors hover:bg-red-700 cursor-pointer disabled:opacity-75"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deleting Account...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Account
            </>
          )}
        </button>
      </div>
    </ModalShell>
  );
}

/* ---------------- Root ---------------- */

type DeleteFlowStep = "none" | "password" | "confirm";

export default function LedgerLiteSettings() {
  const router = useRouter();
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("security");
  const [deleteStep, setDeleteStep] = useState<DeleteFlowStep>("none");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");
  const [deleting, setDeleting] = useState(false);

  const closeDeleteFlow = () => {
    setDeleteStep("none");
    setConfirmPasswordVal("");
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/protected/settings/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: confirmPasswordVal }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        toast.success("Account successfully deleted.");
        router.push("/signup");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete account.");
        setDeleteStep("password"); // Send back to password verification if failed
      }
    } catch (err) {
      toast.error("Network error: Could not delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full bg-white px-0 sm:px-2">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden bg-white lg:flex-row">
        <Sidebar active={activeSection} onSelect={setActiveSection} />

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-10">
          {activeSection === "security" && <SecuritySection />}
          {activeSection === "theme" && <ThemeSection />}
          {activeSection === "notifications" && <NotificationsSection />}
          {activeSection === "feedback" && <FeedbackSection />}
          {activeSection === "account" && (
            <AccountActionSection
              onDeleteAccount={() => setDeleteStep("password")}
            />
          )}
        </main>
      </div>

      {deleteStep === "password" && (
        <ConfirmPasswordModal
          onCancel={closeDeleteFlow}
          onContinue={(pw) => {
            setConfirmPasswordVal(pw);
            setDeleteStep("confirm");
          }}
        />
      )}
      {deleteStep === "confirm" && (
        <DeleteAccountModal
          onCancel={closeDeleteFlow}
          onDelete={handleDeleteConfirm}
          isPending={deleting}
        />
      )}
    </div>
  );
}
