"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Phone, Search, UserPlus } from "lucide-react";
import Modal from "@/components/atoms/admin/Modal";
import { useAssignRider, useRiders } from "@/hooks";
import type { AdminTransactionSummary } from "@/types";

/**
 * Choose who carries a delivery, or swap the rider on it.
 *
 * Only approved riders are offered, each with how many deliveries they already have — the
 * one fact that decides who to call. Picking records the assignment; reaching the rider is
 * still a phone call, so their number is right there.
 */
export default function AssignRiderDialog({
  transaction,
  onClose,
}: {
  transaction: AdminTransactionSummary;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const riders = useRiders({ status: "APPROVED", search: search.trim() || undefined, limit: 50 });
  const assign = useAssignRider();
  const current = transaction.rider;

  const choose = (riderId: string) =>
    assign.mutate(
      { reference: transaction.reference, riderId },
      { onSuccess: onClose }
    );

  return (
    <Modal
      title={current ? "Change rider" : "Assign a rider"}
      description={`${transaction.reference} · ${transaction.buyerName} · ${
        transaction.deliveryAddress ?? "No address"
      }`}
      onClose={onClose}
      width="max-w-lg"
    >
      {current && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 font-dm text-xs text-amber-900">
          Currently <b>{current.name}</b>
          {current.phone ? ` · ${current.phone}` : ""}. Let them know if you replace them.
        </p>
      )}

      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          autoFocus
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name or phone"
          aria-label="Search riders"
          className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 font-dm text-sm focus:border-recommend-green focus:outline-none"
        />
      </div>

      {assign.isError && (
        <p className="mb-3 rounded-lg bg-red-50 p-3 font-dm text-sm text-red-600">
          {assign.error.message}
        </p>
      )}

      <ul className="flex flex-col divide-y divide-gray-100 rounded-xl border border-gray-200">
        {riders.isLoading && (
          <li className="p-4 text-center font-dm text-sm text-gray-400">Loading riders…</li>
        )}
        {riders.isError && (
          <li className="p-4 text-center font-dm text-sm text-red-600">Couldn&apos;t load riders.</li>
        )}
        {riders.data?.items.length === 0 && (
          <li className="flex flex-col items-center gap-2 p-5 text-center font-dm text-sm text-gray-500">
            {search ? "No approved rider matches." : "No approved riders yet."}
            <Link
              href="/admin/riders?add=1"
              className="inline-flex items-center gap-1 font-bold text-recommend-green hover:underline"
            >
              <UserPlus size={14} /> Add a rider
            </Link>
          </li>
        )}
        {riders.data?.items.map((rider) => {
          const isCurrent = rider.id === current?.id;
          return (
            <li key={rider.id} className="flex items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-dm text-sm font-bold text-gray-900">
                  {rider.firstName} {rider.lastName}
                </p>
                <p className="flex flex-wrap items-center gap-x-2 font-dm text-xs text-gray-500">
                  {rider.phoneNumber && (
                    <a
                      href={`tel:${rider.phoneNumber}`}
                      className="inline-flex items-center gap-1 hover:text-recommend-green"
                    >
                      <Phone size={11} /> {rider.phoneNumber}
                    </a>
                  )}
                  <span>
                    {rider.activeDeliveries === 0
                      ? "Free now"
                      : `${rider.activeDeliveries} in progress`}
                  </span>
                </p>
              </div>
              {isCurrent ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 font-dm text-xs font-bold text-green-700">
                  <Check size={13} /> Assigned
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => choose(rider.id)}
                  disabled={assign.isPending}
                  className="rounded-full bg-recommend-green px-3 py-1.5 font-dm text-xs font-bold text-white hover:bg-recommend-green-hover disabled:opacity-50"
                >
                  {assign.isPending && assign.variables?.riderId === rider.id ? "Assigning…" : "Assign"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
