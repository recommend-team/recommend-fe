"use client";

import { useState } from "react";
import { Plus, X, Ban, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAdmins, useCreateAdmin, useSuspendAdmin, useCurrentUser } from "@/hooks";
import { useConfirm } from "@/components/organisms/DialogProvider";
import type { AdminUser } from "@/types";

interface CreateAdminFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,50}$/;

function timeAgo(iso: string | null): string {
  if (!iso) return "Never";
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Active now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

function roleLabel(role: string): string {
  return role === "SUPER_ADMIN" ? "Super Admin" : "Admin";
}

function roleBadgeStyle(role: string): string {
  return role === "SUPER_ADMIN"
    ? "bg-orange-100 text-orange-700"
    : "bg-green-100 text-green-700";
}

export default function AdminManagementPage() {
  const { data: currentUser } = useCurrentUser();
  const confirm = useConfirm();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const admins = useAdmins(page, 20);
  const suspend = useSuspendAdmin();

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const rows = admins.data?.items ?? [];
  const filtered = rows.filter((a) => {
    if (!search) return true;
    const needle = search.toLowerCase();
    return (
      a.email.toLowerCase().includes(needle) ||
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(needle)
    );
  });

  const handleSuspend = async (admin: AdminUser) => {
    const ok = await confirm({
      title: `Suspend ${admin.firstName} ${admin.lastName}?`,
      message:
        "They will be signed out immediately and unable to log in until reactivated.",
      confirmLabel: "Suspend",
      variant: "danger",
    });
    if (!ok) return;
    setActionError(null);
    try {
      await suspend.mutateAsync(admin.id);
    } catch (err) {
      setActionError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Could not suspend admin."
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-dm text-gray-900">
          Admin User Management
        </h1>
        <p className="text-sm font-dm text-gray-500">
          Create and manage administrator accounts.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email"
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green"
            />
          </div>
          {isSuperAdmin && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-full bg-recommend-orange px-4 py-2 text-sm font-bold font-dm text-white hover:bg-orange-600 transition-colors"
            >
              <Plus size={16} />
              Create New Admin
            </button>
          )}
        </div>

        {actionError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            {actionError}
          </p>
        )}
        {admins.isError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            Couldn&apos;t load admins. Refresh to try again.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-dm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                <th className="py-3 pr-4">Admin Name</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Last Active</th>
                <th className="py-3 pr-4 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-gray-400"
                  >
                    Loading admins…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-gray-400"
                  >
                    {search ? "No admins match your search." : "No admins yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b border-gray-100 hover:bg-amber-50/40"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">
                          {admin.firstName} {admin.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {admin.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${roleBadgeStyle(admin.role)}`}
                      >
                        {roleLabel(admin.role)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusPill status={admin.status} />
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {timeAgo(admin.lastLoginAt)}
                    </td>
                    <td className="py-3 pr-4">
                      {isSuperAdmin &&
                      admin.role !== "SUPER_ADMIN" &&
                      admin.status !== "SUSPENDED" &&
                      admin.status !== "DEACTIVATED" ? (
                        <button
                          onClick={() => handleSuspend(admin)}
                          disabled={suspend.isPending}
                          title="Suspend admin"
                          className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors"
                        >
                          <Ban size={16} />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {admins.data && admins.data.total > 0 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs font-dm text-gray-500">
              Showing {rows.length} of {admins.data.total} admin accounts
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-1.5 rounded-full border border-gray-300 bg-white text-sm font-bold font-dm disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 20 >= (admins.data?.total ?? 0)}
                className="px-4 py-1.5 rounded-full bg-recommend-orange text-white text-sm font-bold font-dm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showCreate && isSuperAdmin && (
        <CreateAdminModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; dot: string }> = {
    APPROVED: {
      label: "Active",
      className: "text-green-700",
      dot: "bg-green-500",
    },
    PENDING: {
      label: "Pending",
      className: "text-orange-700",
      dot: "bg-orange-400",
    },
    SUSPENDED: {
      label: "Suspended",
      className: "text-red-700",
      dot: "bg-red-500",
    },
    DEACTIVATED: {
      label: "Deactivated",
      className: "text-gray-500",
      dot: "bg-gray-400",
    },
  };
  const style = map[status] ?? {
    label: status,
    className: "text-gray-500",
    dot: "bg-gray-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold ${style.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

function CreateAdminModal({ onClose }: { onClose: () => void }) {
  const create = useCreateAdmin();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAdminFormValues>({
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const onSubmit = async (values: CreateAdminFormValues) => {
    setSubmitError(null);
    try {
      await create.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      onClose();
    } catch (err) {
      setSubmitError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Could not create admin."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold font-dm text-gray-900 mb-1">
          Create new admin
        </h2>
        <p className="text-sm font-dm text-gray-500 mb-4">
          New admins are created with standard ADMIN role. Only super admins can
          create new accounts.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" error={errors.firstName?.message}>
              <input
                {...register("firstName", {
                  required: "Required",
                  minLength: { value: 2, message: "Min 2 characters" },
                })}
                className={inputStyles}
              />
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              <input
                {...register("lastName", {
                  required: "Required",
                  minLength: { value: 2, message: "Min 2 characters" },
                })}
                className={inputStyles}
              />
            </Field>
          </div>
          <Field label="Email" error={errors.email?.message}>
            <input
              type="email"
              {...register("email", {
                required: "Required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              className={inputStyles}
            />
          </Field>
          <Field
            label="Password"
            error={errors.password?.message}
            hint="8+ chars with upper, lower, and a digit"
          >
            <input
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: "Required",
                pattern: {
                  value: PASSWORD_RULE,
                  message:
                    "Needs upper + lower + digit, min 8 chars",
                },
              })}
              className={inputStyles}
            />
          </Field>

          {submitError && (
            <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={create.isPending}
            className="w-full rounded-full bg-recommend-orange px-4 py-2.5 text-sm font-bold font-dm text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {create.isPending ? "Creating…" : "Create admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyles =
  "w-full h-10 px-3 rounded-lg border border-gray-300 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green";

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-400 font-dm mt-1">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500 font-dm mt-1">{error}</p>}
    </div>
  );
}
