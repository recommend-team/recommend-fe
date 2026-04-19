"use client";

import { useState } from "react";
import { ShieldCheck, Clock, AlertCircle } from "lucide-react";
import PageHeader from "@/components/atoms/admin/PageHeader";
import KycDocField from "@/components/organisms/KycDocField";
import { useMyVendorProfile, useSubmitVendorKyc } from "@/hooks";

type RegisteredKeys = "cacDocumentUrl" | "tinDocumentUrl";
type NonRegisteredKeys =
  | "ninDocumentUrl"
  | "passportPhotoUrl"
  | "bankStatementUrl"
  | "utilityBillUrl";
type AllKeys = RegisteredKeys | NonRegisteredKeys;

const REGISTERED_DOCS: Array<{ key: RegisteredKeys; label: string; hint: string }> =
  [
    {
      key: "cacDocumentUrl",
      label: "CAC certificate",
      hint: "Your Corporate Affairs Commission registration certificate.",
    },
    {
      key: "tinDocumentUrl",
      label: "TIN certificate",
      hint: "Tax Identification Number document from the FIRS.",
    },
  ];

const NON_REGISTERED_DOCS: Array<{
  key: NonRegisteredKeys;
  label: string;
  hint: string;
}> = [
  {
    key: "ninDocumentUrl",
    label: "NIN document",
    hint: "Scan or photo of your National Identification slip/card.",
  },
  {
    key: "passportPhotoUrl",
    label: "Passport-style photo",
    hint: "Clear front-facing photo of the business owner.",
  },
  {
    key: "bankStatementUrl",
    label: "Bank statement",
    hint: "Last 3 months of bank statements for the business account.",
  },
  {
    key: "utilityBillUrl",
    label: "Utility bill",
    hint: "Recent (last 3 months) electricity, water, or similar bill.",
  },
];

export default function VendorKycPage() {
  const profile = useMyVendorProfile();
  const submit = useSubmitVendorKyc();
  const [pending, setPending] = useState<Partial<Record<AllKeys, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isRegistered = profile.data?.vendorType === "REGISTERED";
  const status = profile.data?.status ?? "PENDING";
  const docs = isRegistered ? REGISTERED_DOCS : NON_REGISTERED_DOCS;

  const setPendingUrl = (key: AllKeys, url: string) => {
    setPending((prev) => ({ ...prev, [key]: url }));
  };

  const hasChanges = Object.keys(pending).length > 0;

  const onSubmit = async () => {
    setSubmitError(null);
    setSuccessMessage(null);
    try {
      await submit.mutateAsync(pending);
      setPending({});
      setSuccessMessage(
        "Documents submitted. Our team will review them and update your status — usually within 24 hours."
      );
    } catch (err) {
      setSubmitError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Could not submit KYC."
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="KYC Documents"
        description="Upload the documents we need to verify your business. Approved accounts can list products and receive orders."
      />

      {profile.isLoading ? (
        <p className="text-sm font-dm text-gray-400">Loading profile…</p>
      ) : profile.isError || !profile.data ? (
        <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
          Couldn&apos;t load your profile. Refresh to try again.
        </p>
      ) : (
        <>
          <StatusCard status={status} vendorType={isRegistered ? "REGISTERED" : "NON_REGISTERED"} />

          <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold font-dm text-gray-900">
                {isRegistered
                  ? "Registered-business documents"
                  : "Light-KYC documents"}
              </h2>
              <p className="text-xs font-dm text-gray-500">
                {isRegistered
                  ? "CAC and TIN are required to unlock the registered-business tier."
                  : "Upload at least one document from the list below to start KYC review."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {docs.map((d) => (
                <KycDocField
                  key={d.key}
                  label={d.label}
                  hint={d.hint}
                  currentUrl={
                    profile.data?.[d.key as keyof typeof profile.data] as
                      | string
                      | null
                      | undefined
                  }
                  pendingUrl={pending[d.key]}
                  onUploaded={(url) => setPendingUrl(d.key, url)}
                />
              ))}
            </div>

            {submitError && (
              <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
                {submitError}
              </p>
            )}
            {successMessage && (
              <p className="text-sm font-dm text-green-700 bg-green-50 rounded-lg p-3">
                {successMessage}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-dm text-gray-500">
                {hasChanges
                  ? `${Object.keys(pending).length} file${Object.keys(pending).length === 1 ? "" : "s"} ready to submit.`
                  : "Upload a file above to enable submission."}
              </p>
              <button
                onClick={onSubmit}
                disabled={!hasChanges || submit.isPending}
                className="rounded-full bg-recommend-orange text-white px-5 py-2.5 text-sm font-bold font-dm hover:bg-orange-600 disabled:opacity-50"
              >
                {submit.isPending ? "Submitting…" : "Submit for review"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatusCard({
  status,
  vendorType,
}: {
  status: string;
  vendorType: "REGISTERED" | "NON_REGISTERED";
}) {
  const isApproved = status === "APPROVED";
  const isRejected = status === "DEACTIVATED" || status === "SUSPENDED";

  const icon = isApproved ? (
    <ShieldCheck size={22} />
  ) : isRejected ? (
    <AlertCircle size={22} />
  ) : (
    <Clock size={22} />
  );

  const title = isApproved
    ? "Verification complete"
    : isRejected
      ? "Action required"
      : "Verification in progress";

  const description = isApproved
    ? `Your ${vendorType === "REGISTERED" ? "registered-business" : "light-KYC"} account is fully verified. You can replace documents anytime — submissions re-trigger review.`
    : isRejected
      ? "Your last submission was not approved. Upload fresh documents and resubmit. If you've contacted support, include the ticket reference."
      : "We're reviewing your documents. We'll email you the moment your status changes. Adding more documents now doesn't reset the review timer.";

  return (
    <div
      className={`rounded-2xl border p-5 md:p-6 flex items-start gap-4 ${
        isApproved
          ? "bg-green-50 border-green-200 text-green-800"
          : isRejected
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-[#FFF8B8] border-[#FFD91D] text-gray-900"
      }`}
    >
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="font-bold font-dm">{title}</p>
        <p className="text-sm font-dm leading-relaxed">{description}</p>
        <p className="text-xs font-dm opacity-70 mt-1">
          Tier: {vendorType === "REGISTERED" ? "Registered business" : "Non-registered business"}
        </p>
      </div>
    </div>
  );
}
