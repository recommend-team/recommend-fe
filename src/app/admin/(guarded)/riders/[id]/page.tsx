"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Check,
  X,
  Ban,
  PlayCircle,
  Bike,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  User,
  Users,
  Landmark,
  FileText,
  ExternalLink,
  Tag,
  MessageCircle,
} from "lucide-react";
import StatusPill from "@/components/atoms/admin/StatusPill";
import {
  useUserDetail,
  useApprovePending,
  useRejectPending,
  useSuspendUser,
  useActivateUser,
} from "@/hooks";
import { useConfirm, usePrompt } from "@/components/organisms/DialogProvider";

function maskAccount(acct: string | null | undefined): string {
  if (!acct) return "";
  if (acct.length <= 4) return acct;
  return `${acct.slice(0, 2)}••••${acct.slice(-2)}`;
}

function maskBvn(bvn: string | null | undefined): string {
  if (!bvn) return "";
  if (bvn.length <= 6) return bvn;
  return `${bvn.slice(0, 3)}••••${bvn.slice(-3)}`;
}

export default function RiderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const confirm = useConfirm();
  const prompt = usePrompt();
  const rider = useUserDetail(id);
  const approve = useApprovePending();
  const reject = useRejectPending();
  const suspend = useSuspendUser();
  const activate = useActivateUser();

  const [actionError, setActionError] = useState<string | null>(null);

  const goBack = () => router.push("/admin/riders");

  const runAction = async (fn: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await fn();
    } catch (err) {
      setActionError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Action failed."
      );
    }
  };

  const confirmThenRun = async (
    fn: () => Promise<unknown>,
    options: {
      title: string;
      message?: string;
      confirmLabel?: string;
      variant?: "danger" | "primary";
    }
  ) => {
    const ok = await confirm(options);
    if (ok) runAction(fn);
  };

  if (rider.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <BackLink onClick={goBack} />
        <div className="rounded-2xl bg-white border border-[#FFD91D] p-10 text-center">
          <p className="text-sm font-dm text-gray-400">Loading rider…</p>
        </div>
      </div>
    );
  }
  if (rider.isError || !rider.data) {
    return (
      <div className="flex flex-col gap-3">
        <BackLink onClick={goBack} />
        <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
          Couldn&apos;t load this rider.
        </p>
      </div>
    );
  }

  const r = rider.data;
  if (r.role !== "RIDER") {
    return (
      <div className="flex flex-col gap-3">
        <BackLink onClick={goBack} />
        <p className="text-sm font-dm text-orange-700 bg-orange-50 rounded-lg p-3">
          This user is a {r.role.toLowerCase()}, not a rider.
        </p>
      </div>
    );
  }

  const displayName =
    `${r.firstName} ${r.lastName}`.trim() || "Unnamed rider";
  const isPending = r.status === "PENDING";
  const isApproved = r.status === "APPROVED";
  const isSuspended = r.status === "SUSPENDED";
  const hasPayout = Boolean(
    r.bankName ?? r.bankCode ?? r.bankAccountNumber ?? r.bankAccountName
  );

  return (
    <div className="flex flex-col gap-6">
      <BackLink onClick={goBack} />

      {/* Hero */}
      <section className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-wrap items-center gap-5">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center border-4 border-white shadow-sm">
          {r.profilePicture ? (
            <Image
              src={r.profilePicture}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-2xl md:text-3xl font-bold font-dm text-recommend-orange">
              {(r.firstName?.[0] ?? "").toUpperCase()}
              {(r.lastName?.[0] ?? "").toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold font-dm text-gray-900 truncate">
              {displayName}
            </h1>
            <StatusPill status={r.status} />
          </div>
          <p className="text-sm font-dm text-gray-500 truncate">{r.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip
              icon={Tag}
              label={
                r.riderType === "COMPANY" ? "Fleet / company" : "Solo rider"
              }
              color="orange"
            />
            <Chip
              icon={r.isEmailVerified ? ShieldCheck : ShieldAlert}
              label={r.isEmailVerified ? "Email verified" : "Email unverified"}
              color={r.isEmailVerified ? "green" : "gray"}
            />
            {r.bvn && (
              <Chip
                icon={ShieldCheck}
                label="BVN on file"
                color="green"
              />
            )}
          </div>
        </div>
      </section>

      {actionError && (
        <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
          {actionError}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {isPending && (
          <>
            <ActionButton
              icon={Check}
              label="Approve"
              variant="green"
              loading={approve.isPending}
              onClick={() =>
                confirmThenRun(() => approve.mutateAsync(r.id), {
                  title: "Approve this rider?",
                  message:
                    "They will be able to accept delivery orders on the platform immediately.",
                  confirmLabel: "Approve",
                  variant: "primary",
                })
              }
            />
            <ActionButton
              icon={X}
              label="Reject"
              variant="red"
              loading={reject.isPending}
              onClick={async () => {
                const reason = await prompt({
                  title: "Reject this rider?",
                  message:
                    "Their application will be marked as rejected. The reason is optional but helps them understand what to change.",
                  placeholder: "e.g. Guarantor phone not reachable",
                  confirmLabel: "Reject",
                  variant: "danger",
                  multiline: true,
                });
                if (reason === null) return;
                runAction(() => reject.mutateAsync({ id: r.id, reason }));
              }}
            />
          </>
        )}
        {isApproved && (
          <ActionButton
            icon={Ban}
            label="Suspend"
            variant="red"
            loading={suspend.isPending}
            onClick={() =>
              confirmThenRun(() => suspend.mutateAsync(r.id), {
                title: "Suspend this rider?",
                message:
                  "They will be signed out and can't accept orders until reactivated.",
                confirmLabel: "Suspend",
                variant: "danger",
              })
            }
          />
        )}
        {isSuspended && (
          <ActionButton
            icon={PlayCircle}
            label="Reactivate"
            variant="green"
            loading={activate.isPending}
            onClick={() =>
              confirmThenRun(() => activate.mutateAsync(r.id), {
                title: "Reactivate this rider?",
                message: "They will be able to accept orders immediately.",
                confirmLabel: "Reactivate",
                variant: "primary",
              })
            }
          />
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InfoCard title="Contact" icon={User}>
          <InfoRow icon={User} label="Name" value={displayName} />
          <InfoRow icon={Mail} label="Email" value={r.email} />
          <InfoRow icon={Phone} label="Phone" value={r.phoneNumber} />
          <InfoRow
            icon={Calendar}
            label="Joined"
            value={new Date(r.createdAt).toLocaleDateString(undefined, {
              dateStyle: "long",
            })}
          />
          {r.lastLoginAt && (
            <InfoRow
              icon={Calendar}
              label="Last login"
              value={new Date(r.lastLoginAt).toLocaleString()}
            />
          )}
          <InfoRow
            icon={Bike}
            label="Rider type"
            value={r.riderType === "COMPANY" ? "Fleet / company" : "Solo rider"}
          />
        </InfoCard>

        <InfoCard title="Identity & guarantor" icon={ShieldCheck}>
          <InfoRow
            icon={ShieldCheck}
            label="BVN"
            value={r.bvn ? maskBvn(r.bvn) : null}
            emptyHint="Not provided"
            hint={
              r.bvn ? "Masked for privacy. Full value visible to SUPER_ADMIN." : undefined
            }
          />
          <InfoRow
            icon={Users}
            label="Guarantor name"
            value={r.guarantorName}
            emptyHint="No guarantor submitted"
          />
          <InfoRow
            icon={MessageCircle}
            label="Guarantor phone"
            value={r.guarantorPhone}
            emptyHint="—"
          />
        </InfoCard>

        <InfoCard title="KYC documents" icon={FileText}>
          <KycDocRow
            label="Government ID"
            url={r.governmentIdUrl}
          />
          <KycDocRow label="Selfie" url={r.selfieUrl} />
          <p className="text-xs font-dm text-gray-400 mt-1">
            Documents open in a new tab (served from Cloudinary).
          </p>
        </InfoCard>

        <InfoCard title="Payout account" icon={Landmark}>
          {!hasPayout ? (
            <EmptyBlock
              icon={Landmark}
              message="Rider hasn't submitted bank details yet. Earnings cannot be paid out until this is set."
            />
          ) : (
            <>
              <InfoRow icon={Landmark} label="Bank" value={r.bankName} />
              <InfoRow icon={Tag} label="Bank code" value={r.bankCode} />
              <InfoRow
                icon={Landmark}
                label="Account number"
                value={maskAccount(r.bankAccountNumber)}
              />
              <InfoRow
                icon={User}
                label="Account name"
                value={r.bankAccountName}
              />
            </>
          )}
        </InfoCard>
      </div>
    </div>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-dm text-gray-500 flex items-center gap-1 w-fit hover:text-recommend-orange cursor-pointer"
    >
      <ArrowLeft size={14} /> Back to riders
    </button>
  );
}

function Chip({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: "orange" | "green" | "gray";
}) {
  const styles = {
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    green: "bg-green-50 text-green-700 border-green-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold font-dm ${styles[color]}`}
    >
      <Icon size={12} />
      {label}
    </span>
  );
}

function InfoCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-3">
      <header className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center text-recommend-orange">
          <Icon size={14} />
        </div>
        <h3 className="text-base font-bold font-dm text-gray-900">{title}</h3>
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  emptyHint,
  hint,
}: {
  icon?: React.ElementType;
  label: string;
  value: string | null | undefined | React.ReactNode;
  emptyHint?: string;
  hint?: string;
}) {
  const isEmpty =
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "");

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5 text-[11px] font-bold font-dm uppercase tracking-wide text-gray-500">
        {Icon && <Icon size={11} />}
        <span>{label}</span>
      </div>
      <div
        className={`text-sm font-dm ${
          isEmpty ? "text-gray-400 italic" : "text-gray-900"
        }`}
      >
        {isEmpty ? emptyHint ?? "Not provided" : value}
      </div>
      {hint && <p className="text-xs font-dm text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function KycDocRow({
  label,
  url,
}: {
  label: string;
  url: string | null | undefined;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
          url ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"
        }`}
      >
        <FileText size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold font-dm text-gray-900">{label}</p>
        <p className="text-xs font-dm text-gray-500">
          {url ? "Submitted" : "Not uploaded"}
        </p>
      </div>
      {url && (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-xs font-bold font-dm text-gray-700 hover:border-recommend-orange hover:text-recommend-orange"
        >
          View <ExternalLink size={11} />
        </Link>
      )}
    </div>
  );
}

function EmptyBlock({
  icon: Icon,
  message,
}: {
  icon: React.ElementType;
  message: string;
}) {
  return (
    <div className="py-6 flex flex-col items-center text-center gap-2">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
        <Icon size={18} />
      </div>
      <p className="text-sm font-dm text-gray-400">{message}</p>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  variant,
  loading,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  variant: "green" | "red";
  loading?: boolean;
  onClick: () => void;
}) {
  const base =
    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold font-dm disabled:opacity-50 transition-colors";
  const style =
    variant === "green"
      ? "bg-recommend-green text-white hover:bg-recommend-green-hover"
      : "bg-red-600 text-white hover:bg-red-700";
  return (
    <button onClick={onClick} disabled={loading} className={`${base} ${style}`}>
      <Icon size={16} />
      {loading ? "Working…" : label}
    </button>
  );
}

