"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, X, Ban, PlayCircle } from "lucide-react";
import StatusPill from "@/components/atoms/admin/StatusPill";
import PageHeader from "@/components/atoms/admin/PageHeader";
import {
  useVendorDetail,
  useApprovePending,
  useRejectPending,
  useSuspendUser,
  useActivateUser,
} from "@/hooks";
import { useConfirm, usePrompt } from "@/components/organisms/DialogProvider";

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-dm text-gray-500 flex items-center gap-1 w-fit hover:text-recommend-orange cursor-pointer"
    >
      <ArrowLeft size={14} /> Back to vendors
    </button>
  );
}

export default function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const confirm = useConfirm();
  const prompt = usePrompt();
  const vendor = useVendorDetail(id);
  const approve = useApprovePending();
  const reject = useRejectPending();
  const suspend = useSuspendUser();
  const activate = useActivateUser();

  const [actionError, setActionError] = useState<string | null>(null);

  const goBack = () => router.push("/admin/vendors");

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

  if (vendor.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <BackLink onClick={goBack} />
        <p className="text-sm font-dm text-gray-400">Loading vendor…</p>
      </div>
    );
  }
  if (vendor.isError || !vendor.data) {
    return (
      <div className="flex flex-col gap-3">
        <BackLink onClick={goBack} />
        <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
          Couldn&apos;t load this vendor.
        </p>
      </div>
    );
  }

  const { vendor: v, products, productCount } = vendor.data;
  const isPending = v.status === "PENDING";
  const isApproved = v.status === "APPROVED";
  const isSuspended = v.status === "SUSPENDED";

  return (
    <div className="flex flex-col gap-6">
      <BackLink onClick={goBack} />

      <PageHeader
        title={v.businessName ?? `${v.firstName} ${v.lastName}`}
        description={v.email}
        right={<StatusPill status={v.status} />}
      />

      {actionError && (
        <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
          {actionError}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {isPending && (
          <>
            <ActionButton
              icon={Check}
              label="Approve"
              variant="green"
              loading={approve.isPending}
              onClick={() =>
                confirmThenRun(() => approve.mutateAsync(v.id), {
                  title: "Approve this vendor?",
                  message:
                    "They will be able to list products and receive orders immediately.",
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
                  title: "Reject this vendor?",
                  message:
                    "Their application will be marked as rejected. The reason is optional but helps them understand what to improve.",
                  placeholder: "e.g. KYC documents unreadable",
                  confirmLabel: "Reject",
                  variant: "danger",
                  multiline: true,
                });
                if (reason === null) return;
                runAction(() => reject.mutateAsync({ id: v.id, reason }));
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
              confirmThenRun(() => suspend.mutateAsync(v.id), {
                title: "Suspend this vendor?",
                message:
                  "Their store will go offline and they cannot receive new orders until reactivated.",
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
              confirmThenRun(() => activate.mutateAsync(v.id), {
                title: "Reactivate this vendor?",
                message: "Their store will immediately go back online.",
                confirmLabel: "Reactivate",
                variant: "primary",
              })
            }
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DetailCard title="Business">
          <DetailRow label="Name" value={v.businessName ?? "—"} />
          <DetailRow label="Slug" value={v.slug ?? "—"} />
          <DetailRow
            label="Tier"
            value={
              v.vendorType === "REGISTERED" ? "Registered" : "Non-registered"
            }
          />
          <DetailRow label="Category" value={v.businessCategory ?? "—"} />
          <DetailRow label="Address" value={v.businessAddress ?? "—"} />
          <DetailRow
            label="Description"
            value={v.businessDescription ?? "—"}
          />
          <DetailRow label="Open now" value={v.isOpen ? "Yes" : "No"} />
        </DetailCard>

        <DetailCard title="Contact">
          <DetailRow
            label="Owner"
            value={`${v.firstName} ${v.lastName}`.trim() || "—"}
          />
          <DetailRow label="Email" value={v.email} />
          <DetailRow label="Phone" value={v.phoneNumber} />
          <DetailRow
            label="Email verified"
            value={v.isEmailVerified ? "Yes" : "No"}
          />
          <DetailRow
            label="Created"
            value={new Date(v.createdAt).toLocaleString()}
          />
        </DetailCard>

        <DetailCard title={`Products (${productCount})`}>
          {products.length === 0 ? (
            <p className="text-sm font-dm text-gray-400">
              No products listed yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {products.slice(0, 6).map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 text-sm font-dm"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
                    {p.imageUrl && (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₦{Number(p.price).toLocaleString("en-NG")}
                    </p>
                  </div>
                </li>
              ))}
              {products.length > 6 && (
                <li className="text-xs text-gray-400 font-dm">
                  +{products.length - 6} more not shown
                </li>
              )}
            </ul>
          )}
        </DetailCard>
      </div>
    </div>
  );
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 flex flex-col gap-3">
      <h3 className="text-base font-bold font-dm text-gray-900">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm font-dm">
      <span className="text-gray-500 w-24 shrink-0">{label}</span>
      <span className="text-gray-800 flex-1 break-words">{value}</span>
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
