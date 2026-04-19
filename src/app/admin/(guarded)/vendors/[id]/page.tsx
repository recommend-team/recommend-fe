"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  Ban,
  PlayCircle,
  Store,
  Package,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Tag,
  Globe,
  ShieldCheck,
  ShieldAlert,
  Clock,
  FileText,
  ExternalLink,
  Landmark,
  User,
  MessageCircle,
} from "lucide-react";
import StatusPill from "@/components/atoms/admin/StatusPill";
import {
  useVendorDetail,
  useApprovePending,
  useRejectPending,
  useSuspendUser,
  useActivateUser,
} from "@/hooks";
import { useConfirm, usePrompt } from "@/components/organisms/DialogProvider";
import type { AdminVendorDetail, Product } from "@/types";

const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function formatNaira(raw: string | number): string {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (!Number.isFinite(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

function maskAccount(acct: string | null | undefined): string {
  if (!acct) return "";
  if (acct.length <= 4) return acct;
  return `${acct.slice(0, 2)}••••${acct.slice(-2)}`;
}

type TabKey = "overview" | "profile" | "payout" | "kyc";

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tab, setTab] = useState<TabKey>("overview");

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
        <div className="rounded-2xl bg-white border border-[#FFD91D] p-10 text-center">
          <p className="text-sm font-dm text-gray-400">Loading vendor…</p>
        </div>
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

  const data = vendor.data;
  const v = data.vendor;
  const { products, productCount } = data;
  const isPending = v.status === "PENDING";
  const isApproved = v.status === "APPROVED";
  const isSuspended = v.status === "SUSPENDED";
  const displayName =
    v.businessName || `${v.firstName} ${v.lastName}`.trim() || "Unnamed vendor";

  return (
    <div className="flex flex-col gap-6">
      <BackLink onClick={goBack} />

      {/* Vendor hero */}
      <section className="rounded-2xl bg-white border border-[#FFD91D] overflow-hidden">
        <div className="relative h-32 md:h-40 bg-gradient-to-br from-[#FFF8B8] to-[#FFD91D]/30">
          {v.businessBannerUrl && (
            <Image
              src={v.businessBannerUrl}
              alt=""
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="px-5 md:px-7 pb-5 md:pb-6 -mt-10 md:-mt-12">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-white bg-white shadow-sm overflow-hidden shrink-0">
              {v.businessLogoUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={v.businessLogoUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-50 text-recommend-orange text-2xl font-bold font-dm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-10 md:pt-12">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold font-dm text-gray-900 truncate">
                  {displayName}
                </h1>
                <StatusPill status={v.status} />
              </div>
              <p className="text-sm font-dm text-gray-500 truncate">
                {v.email}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Chip
              icon={Tag}
              label={
                v.vendorType === "REGISTERED"
                  ? "Registered business"
                  : "Non-registered"
              }
              color={v.vendorType === "REGISTERED" ? "orange" : "gray"}
            />
            <Chip
              icon={Store}
              label={v.isOpen ? "Open now" : "Closed"}
              color={v.isOpen ? "green" : "gray"}
            />
            {v.businessCategory && (
              <Chip icon={Tag} label={v.businessCategory} color="gray" />
            )}
            <Chip
              icon={Package}
              label={`${productCount} product${productCount === 1 ? "" : "s"}`}
              color="gray"
            />
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

      {/* Tabs */}
      <div className="rounded-2xl bg-white border border-[#FFD91D] p-1.5 flex gap-1 overflow-x-auto">
        <TabButton
          active={tab === "overview"}
          onClick={() => setTab("overview")}
          icon={Store}
          label="Overview"
        />
        <TabButton
          active={tab === "profile"}
          onClick={() => setTab("profile")}
          icon={User}
          label="Profile"
        />
        <TabButton
          active={tab === "payout"}
          onClick={() => setTab("payout")}
          icon={Landmark}
          label="Payout"
        />
        <TabButton
          active={tab === "kyc"}
          onClick={() => setTab("kyc")}
          icon={ShieldCheck}
          label="KYC"
          badge={kycDocCount(v) ? String(kycDocCount(v)) : undefined}
        />
      </div>

      {tab === "overview" && (
        <OverviewTab
          vendor={v}
          productCount={productCount}
          products={products}
          onSelectProduct={setSelectedProduct}
        />
      )}
      {tab === "profile" && <ProfileTab vendor={v} />}
      {tab === "payout" && <PayoutTab vendor={v} />}
      {tab === "kyc" && <KycTab vendor={v} />}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

function OverviewTab({
  vendor: v,
  productCount,
  products,
  onSelectProduct,
}: {
  vendor: AdminVendorDetail["vendor"];
  productCount: number;
  products: Product[];
  onSelectProduct: (p: Product) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <InfoCard title="Business" icon={Store}>
        <InfoRow
          icon={Store}
          label="Business name"
          value={v.businessName}
          emptyHint="Vendor hasn't set a business name yet"
        />
        <InfoRow
          icon={Globe}
          label="Storefront slug"
          value={v.slug}
          emptyHint="Not generated yet"
        />
        <InfoRow
          icon={Tag}
          label="Category"
          value={v.businessCategory}
          emptyHint="No category set"
        />
        <InfoRow
          icon={MapPin}
          label="Address"
          value={v.businessAddress}
          emptyHint="No address provided"
        />
        <InfoRow
          icon={Package}
          label="Description"
          value={v.businessDescription}
          emptyHint="No description"
          multiline
        />
      </InfoCard>

      <InfoCard title="Contact" icon={Phone}>
        <InfoRow
          icon={User}
          label="Owner"
          value={`${v.firstName} ${v.lastName}`.trim() || null}
          emptyHint="Unknown"
        />
        <InfoRow icon={Mail} label="Email" value={v.email} />
        <InfoRow icon={Phone} label="Phone" value={v.phoneNumber} />
        <InfoRow
          icon={v.isEmailVerified ? ShieldCheck : ShieldAlert}
          label="Email verified"
          value={
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                v.isEmailVerified ? "text-green-700" : "text-orange-600"
              }`}
            >
              {v.isEmailVerified ? "Verified" : "Unverified"}
            </span>
          }
        />
        <InfoRow
          icon={Calendar}
          label="Joined"
          value={new Date(v.createdAt).toLocaleDateString(undefined, {
            dateStyle: "long",
          })}
        />
      </InfoCard>

      <InfoCard title={`Products (${productCount})`} icon={Package}>
        {products.length === 0 ? (
          <div className="py-6 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2 text-gray-400">
              <Package size={18} />
            </div>
            <p className="text-sm font-dm text-gray-400">
              No products listed yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {products.slice(0, 8).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectProduct(p)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-amber-50 active:bg-amber-100 text-left transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-base">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold font-dm text-gray-900 truncate">
                    {p.name}
                  </p>
                  <p className="text-xs font-dm text-gray-500">
                    {formatNaira(p.price)}
                    {!p.isAvailable && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-gray-400">
                        Unavailable
                      </span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">›</span>
              </button>
            ))}
            {products.length > 8 && (
              <p className="text-xs text-gray-400 font-dm pt-1 text-center">
                +{products.length - 8} more not shown
              </p>
            )}
          </div>
        )}
      </InfoCard>
    </div>
  );
}

function ProfileTab({ vendor: v }: { vendor: AdminVendorDetail["vendor"] }) {
  const operatingHours = v.operatingHours ?? null;
  const deliveryAreas = v.businessAreas ?? [];
  const hasHours =
    operatingHours && Object.keys(operatingHours).length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <InfoCard title="Owner profile" icon={User}>
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-recommend-orange text-xl font-bold font-dm">
            {(v.firstName?.[0] ?? "").toUpperCase()}
            {(v.lastName?.[0] ?? "").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold font-dm text-gray-900 truncate">
              {`${v.firstName} ${v.lastName}`.trim() || "Unnamed"}
            </p>
            <p className="text-xs font-dm text-gray-500 truncate">
              {v.role === "SELLER" ? "Vendor" : v.role}
            </p>
          </div>
        </div>
        <InfoRow icon={Mail} label="Email" value={v.email} />
        <InfoRow icon={Phone} label="Phone" value={v.phoneNumber} />
        <InfoRow
          icon={MessageCircle}
          label="WhatsApp (orders)"
          value={v.whatsappNumber}
          emptyHint="Not set — orders can't route via WhatsApp yet"
        />
        <InfoRow
          icon={v.isEmailVerified ? ShieldCheck : ShieldAlert}
          label="Email verified"
          value={
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                v.isEmailVerified ? "text-green-700" : "text-orange-600"
              }`}
            >
              {v.isEmailVerified ? "Verified" : "Unverified"}
            </span>
          }
        />
        <InfoRow
          icon={Calendar}
          label="Joined"
          value={new Date(v.createdAt).toLocaleDateString(undefined, {
            dateStyle: "long",
          })}
        />
        {typeof v.orderQuota === "number" && (
          <InfoRow
            icon={Package}
            label="Order quota"
            value={`${v.monthlyOrderCount ?? 0} / ${v.orderQuota} this month`}
          />
        )}
      </InfoCard>

      <InfoCard title="Operating hours" icon={Clock}>
        {!hasHours ? (
          <EmptyBlock
            icon={Clock}
            message="Vendor hasn't configured operating hours yet."
          />
        ) : (
          <div className="flex flex-col gap-1.5">
            {[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].map((day) => {
              const h = operatingHours?.[day];
              const isOpen = h?.isOpen;
              return (
                <div
                  key={day}
                  className="flex items-center justify-between text-sm font-dm py-1.5 border-b border-gray-100 last:border-b-0"
                >
                  <span className="font-bold text-gray-800 w-28 shrink-0">
                    {DAY_LABELS[day]}
                  </span>
                  {isOpen ? (
                    <span className="text-gray-800">
                      {h?.open} – {h?.close}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Closed</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </InfoCard>

      <InfoCard title="Delivery areas" icon={MapPin}>
        {deliveryAreas.length === 0 ? (
          <EmptyBlock
            icon={MapPin}
            message="No delivery areas configured."
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {deliveryAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1 text-xs font-bold font-dm"
              >
                <MapPin size={11} />
                {area}
              </span>
            ))}
          </div>
        )}
      </InfoCard>

      <InfoCard title="Storefront" icon={Globe}>
        <InfoRow
          icon={Globe}
          label="Public slug"
          value={v.slug ? `/store/${v.slug}` : null}
          emptyHint="Slug auto-generates when business name is set"
        />
        {v.slug && (
          <Link
            href={`/store/${v.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold font-dm text-gray-700 hover:border-recommend-orange hover:text-recommend-orange w-fit"
          >
            Open public storefront <ExternalLink size={11} />
          </Link>
        )}
        <InfoRow
          icon={Store}
          label="Open right now"
          value={
            <span
              className={`inline-flex items-center gap-1.5 font-bold ${
                v.isOpen ? "text-green-700" : "text-gray-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  v.isOpen ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {v.isOpen ? "Yes" : "No"}
            </span>
          }
        />
        {v.businessBannerUrl && (
          <div className="mt-2">
            <p className="text-[11px] font-bold font-dm uppercase tracking-wide text-gray-500 mb-1">
              Banner preview
            </p>
            <div className="relative aspect-[3/1] w-full rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={v.businessBannerUrl}
                alt="Store banner"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </InfoCard>
    </div>
  );
}

function PayoutTab({ vendor: v }: { vendor: AdminVendorDetail["vendor"] }) {
  const hasPayout = Boolean(
    v.bankName ?? v.bankCode ?? v.bankAccountNumber ?? v.bankAccountName
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <InfoCard title="Payout account" icon={Landmark}>
        {!hasPayout ? (
          <EmptyBlock
            icon={Landmark}
            message="Vendor hasn't submitted bank details yet. Earnings cannot be paid out until this is set."
          />
        ) : (
          <>
            <InfoRow
              icon={Landmark}
              label="Bank"
              value={v.bankName}
              emptyHint="—"
            />
            <InfoRow
              icon={Tag}
              label="Bank code"
              value={v.bankCode}
              emptyHint="—"
            />
            <InfoRow
              icon={Landmark}
              label="Account number"
              value={maskAccount(v.bankAccountNumber)}
              emptyHint="—"
            />
            <InfoRow
              icon={User}
              label="Account name"
              value={v.bankAccountName}
              emptyHint="—"
            />
          </>
        )}
      </InfoCard>
    </div>
  );
}

function KycTab({ vendor: v }: { vendor: AdminVendorDetail["vendor"] }) {
  const isRegistered = v.vendorType === "REGISTERED";
  const docs = isRegistered
    ? ([
        { key: "cacDocumentUrl", label: "CAC certificate" },
        { key: "tinDocumentUrl", label: "TIN certificate" },
      ] as const)
    : ([
        { key: "ninDocumentUrl", label: "NIN document" },
        { key: "passportPhotoUrl", label: "Passport-style photo" },
        { key: "bankStatementUrl", label: "Bank statement" },
        { key: "utilityBillUrl", label: "Utility bill" },
      ] as const);

  const submittedCount = docs.filter(
    (d) => v[d.key as keyof typeof v]
  ).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <InfoCard title="KYC documents" icon={ShieldCheck}>
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              submittedCount === docs.length
                ? "bg-green-100 text-green-700"
                : submittedCount > 0
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            <ShieldCheck size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold font-dm text-gray-900">
              {isRegistered
                ? "Registered-business tier"
                : "Light-KYC tier"}
            </p>
            <p className="text-xs font-dm text-gray-500">
              {submittedCount} of {docs.length} documents submitted
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          {docs.map((d) => {
            const url = v[d.key as keyof typeof v] as
              | string
              | null
              | undefined;
            return (
              <div
                key={d.key}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    url
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold font-dm text-gray-900">
                    {d.label}
                  </p>
                  <p className="text-xs font-dm text-gray-500">
                    {url ? "Submitted" : "Not uploaded yet"}
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
          })}
        </div>

        <p className="text-xs font-dm text-gray-400 mt-2">
          Documents are served from Cloudinary and open in a new tab.
        </p>
      </InfoCard>
    </div>
  );
}

function kycDocCount(v: AdminVendorDetail["vendor"]): number {
  const isRegistered = v.vendorType === "REGISTERED";
  const keys = isRegistered
    ? (["cacDocumentUrl", "tinDocumentUrl"] as const)
    : ([
        "ninDocumentUrl",
        "passportPhotoUrl",
        "bankStatementUrl",
        "utilityBillUrl",
      ] as const);
  return keys.filter((k) => v[k as keyof typeof v]).length;
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold font-dm whitespace-nowrap transition-colors ${
        active
          ? "bg-recommend-orange text-white"
          : "text-gray-600 hover:bg-amber-100"
      }`}
    >
      <Icon size={15} />
      {label}
      {badge && (
        <span
          className={`inline-flex items-center justify-center rounded-full text-[10px] px-1.5 h-4 min-w-4 font-bold ${
            active
              ? "bg-white/25 text-white"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

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
  multiline,
}: {
  icon?: React.ElementType;
  label: string;
  value: string | null | undefined | React.ReactNode;
  emptyHint?: string;
  multiline?: boolean;
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
        } ${multiline ? "whitespace-pre-wrap" : "truncate"}`}
      >
        {isEmpty ? emptyHint ?? "Not provided" : value}
      </div>
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
    <div className="py-8 flex flex-col items-center text-center gap-2">
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

function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="relative">
          <div className="relative aspect-[16/9] bg-gray-100">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
                📦
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold font-dm text-gray-900">
                {product.name}
              </h2>
              <p className="text-2xl font-bold font-dm text-recommend-orange mt-1">
                {formatNaira(product.price)}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold font-dm shrink-0 ${
                product.isAvailable
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  product.isAvailable ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {product.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          {product.description ? (
            <div>
              <p className="text-[11px] font-bold font-dm uppercase tracking-wide text-gray-500 mb-1">
                Description
              </p>
              <p className="text-sm font-dm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>
          ) : (
            <p className="text-sm font-dm text-gray-400 italic">
              No description provided.
            </p>
          )}

          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-dm text-gray-400">
              Product ID: {product.id}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-bold font-dm text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
