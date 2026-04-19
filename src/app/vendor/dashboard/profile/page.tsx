"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Lock,
  ExternalLink,
  Tag,
  Package,
  Store,
  Info,
  KeyRound,
} from "lucide-react";
import PageHeader from "@/components/atoms/admin/PageHeader";
import StatusPill from "@/components/atoms/admin/StatusPill";
import { useMyVendorProfile, useForgotPassword } from "@/hooks";

export default function VendorProfilePage() {
  const profile = useMyVendorProfile();
  const forgotPassword = useForgotPassword();
  const [resetState, setResetState] = useState<
    | { kind: "idle" }
    | { kind: "sending" }
    | { kind: "sent" }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const handlePasswordReset = async () => {
    if (!profile.data?.email) return;
    setResetState({ kind: "sending" });
    try {
      await forgotPassword.mutateAsync({ email: profile.data.email });
      setResetState({ kind: "sent" });
    } catch (err) {
      setResetState({
        kind: "error",
        message:
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Couldn't send reset email. Try again in a moment.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Profile"
        description="Your account details. Business and storefront info live under Store."
      />

      {profile.isLoading ? (
        <div className="rounded-2xl bg-white border border-[#FFD91D] p-10 text-center">
          <p className="text-sm font-dm text-gray-400">Loading profile…</p>
        </div>
      ) : profile.isError || !profile.data ? (
        <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
          Couldn&apos;t load your profile. Refresh to try again.
        </p>
      ) : (
        <>
          <ProfileHero profile={profile.data} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InfoCard title="Personal details" icon={User}>
              <InfoRow
                icon={User}
                label="First name"
                value={profile.data.firstName}
              />
              <InfoRow
                icon={User}
                label="Last name"
                value={profile.data.lastName}
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={profile.data.email}
                badge={
                  <VerifiedBadge verified={profile.data.isEmailVerified} />
                }
              />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={profile.data.phoneNumber}
              />
              <InfoRow
                icon={Calendar}
                label="Joined"
                value={new Date(profile.data.createdAt).toLocaleDateString(
                  undefined,
                  { dateStyle: "long" }
                )}
              />

              <div className="mt-1 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3">
                <Info size={14} className="text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs font-dm text-amber-900 leading-relaxed">
                  Name, email, and phone are locked to keep your account
                  identity stable. To change them, contact{" "}
                  <Link href="/contact" className="underline font-bold">
                    support
                  </Link>
                  .
                </p>
              </div>
            </InfoCard>

            <InfoCard title="Account" icon={ShieldCheck}>
              <InfoRow
                icon={Tag}
                label="Tier"
                value={
                  profile.data.vendorType === "REGISTERED"
                    ? "Registered business"
                    : "Non-registered business"
                }
              />
              <InfoRow
                icon={ShieldCheck}
                label="Status"
                value={<StatusPill status={profile.data.status} />}
              />
              {typeof profile.data.orderQuota === "number" && (
                <InfoRow
                  icon={Package}
                  label="Order quota"
                  value={`${profile.data.monthlyOrderCount ?? 0} / ${profile.data.orderQuota} this month`}
                  hint="Non-registered tier caps monthly orders. Upgrade to Registered for unlimited orders."
                />
              )}
              <InfoRow
                icon={Store}
                label="Storefront slug"
                value={profile.data.slug}
                emptyHint="Set a business name in Store to auto-generate your public URL"
              />
              {profile.data.slug && (
                <Link
                  href={`/store/${profile.data.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold font-dm text-gray-700 hover:border-recommend-orange hover:text-recommend-orange w-fit"
                >
                  Open public storefront <ExternalLink size={11} />
                </Link>
              )}
            </InfoCard>

            <InfoCard title="Security" icon={Lock}>
              <p className="text-sm font-dm text-gray-600">
                We don&apos;t let vendors change their password in-app for
                security. Hit the button below and we&apos;ll email you a
                reset link.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={
                    resetState.kind === "sending" || !profile.data?.email
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-recommend-orange text-white px-4 py-2 text-sm font-bold font-dm hover:bg-orange-600 disabled:opacity-50"
                >
                  <KeyRound size={15} />
                  {resetState.kind === "sending"
                    ? "Sending…"
                    : "Email me a reset link"}
                </button>
              </div>

              {resetState.kind === "sent" && (
                <p className="text-sm font-dm text-green-700 bg-green-50 rounded-lg p-3">
                  Reset link sent to{" "}
                  <span className="font-bold">{profile.data.email}</span>.
                  Check your inbox and spam folder. The link expires in 60
                  minutes.
                </p>
              )}
              {resetState.kind === "error" && (
                <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
                  {resetState.message}
                </p>
              )}
            </InfoCard>

            <InfoCard title="Where to edit" icon={Info}>
              <p className="text-sm font-dm text-gray-600">
                Other settings live on their own tabs:
              </p>
              <div className="flex flex-col gap-2">
                <QuickLink
                  href="/vendor/dashboard/store"
                  icon={Store}
                  title="Business branding & hours"
                  description="Logo, banner, description, address, operating hours, open/closed toggle."
                />
                <QuickLink
                  href="/vendor/dashboard/store"
                  icon={Tag}
                  title="Bank payout"
                  description="Update the account we send your earnings to."
                />
                <QuickLink
                  href="/vendor/dashboard/kyc"
                  icon={ShieldCheck}
                  title="KYC documents"
                  description="Upload or replace verification documents."
                />
              </div>
            </InfoCard>
          </div>
        </>
      )}
    </div>
  );
}

function ProfileHero({
  profile,
}: {
  profile: ReturnType<typeof useMyVendorProfile>["data"] & NonNullable<unknown>;
}) {
  const initials =
    `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase() ||
    "V";
  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() || "Vendor";

  return (
    <section className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-wrap items-center gap-5">
      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
        {profile.businessLogoUrl ? (
          <Image
            src={profile.businessLogoUrl}
            alt={fullName}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-2xl md:text-3xl font-bold font-dm text-recommend-orange">
            {initials}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl md:text-2xl font-bold font-dm text-gray-900 truncate">
            {fullName}
          </h2>
          <VerifiedBadge verified={profile.isEmailVerified} />
        </div>
        <p className="text-sm font-dm text-gray-500 truncate">{profile.email}</p>
        {profile.businessName && (
          <p className="text-sm font-dm text-gray-500 truncate">
            Runs <span className="font-bold text-gray-700">{profile.businessName}</span>
          </p>
        )}
      </div>
      <StatusPill status={profile.status} />
    </section>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold font-dm ${
        verified
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-orange-50 text-orange-700 border-orange-200"
      }`}
    >
      {verified ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
      {verified ? "Email verified" : "Email unverified"}
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
  badge,
}: {
  icon?: React.ElementType;
  label: string;
  value: string | null | undefined | React.ReactNode;
  emptyHint?: string;
  hint?: string;
  badge?: React.ReactNode;
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
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-sm font-dm ${
            isEmpty ? "text-gray-400 italic" : "text-gray-900"
          }`}
        >
          {isEmpty ? emptyHint ?? "Not provided" : value}
        </span>
        {badge}
      </div>
      {hint && (
        <p className="text-xs font-dm text-gray-400 mt-0.5">{hint}</p>
      )}
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 hover:border-recommend-orange hover:bg-amber-50/40 transition-colors"
    >
      <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-recommend-orange shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold font-dm text-gray-900">{title}</p>
        <p className="text-xs font-dm text-gray-500">{description}</p>
      </div>
      <span className="text-gray-400 self-center">›</span>
    </Link>
  );
}
