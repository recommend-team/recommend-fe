"use client";

import { useState } from "react";
import Modal from "@/components/atoms/admin/Modal";
import { useUpdateVendor } from "@/hooks";
import type { AdminVendorDetail, DaySchedule, WeekDay } from "@/types";
import { FormActions, FormError } from "./form";

const DAYS: { key: WeekDay; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const DEFAULT_DAY: DaySchedule = { isOpen: true, open: "08:00", close: "20:00" };

const TIME =
  "h-9 rounded-lg border border-gray-300 bg-white px-2 font-dm text-sm focus:border-recommend-green focus:outline-none disabled:bg-gray-50 disabled:text-gray-300";

/**
 * Opening hours. Buyers can order only inside them, and only while the store isn't paused
 * (the open/closed switch). A closing time earlier than the opening time closes the next
 * day; the same time means open all day — the backend's rule, so neither is refused.
 */
export default function EditHoursDialog({
  vendor,
  onClose,
}: {
  vendor: AdminVendorDetail["vendor"];
  onClose: () => void;
}) {
  const update = useUpdateVendor(vendor.id);
  const [week, setWeek] = useState<Record<WeekDay, DaySchedule>>(() =>
    Object.fromEntries(
      DAYS.map(({ key }) => [key, vendor.operatingHours?.[key] ?? DEFAULT_DAY])
    ) as Record<WeekDay, DaySchedule>
  );

  const set = (day: WeekDay, patch: Partial<DaySchedule>) =>
    setWeek((current) => ({ ...current, [day]: { ...current[day], ...patch } }));

  const noneOpen = !DAYS.some(({ key }) => week[key].isOpen);

  return (
    <Modal
      title="Opening hours"
      description="Buyers can order only inside these hours, and only while the store isn't paused."
      onClose={onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (noneOpen) return;
          update.mutate({ operatingHours: week }, { onSuccess: onClose });
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col divide-y divide-gray-100">
          {DAYS.map(({ key, label }) => {
            const day = week[key];
            return (
              <div key={key} className="flex flex-wrap items-center gap-3 py-2 font-dm text-sm">
                <label className="flex w-32 cursor-pointer items-center gap-2 font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={day.isOpen}
                    onChange={(e) => set(key, { isOpen: e.target.checked })}
                  />
                  {label}
                </label>
                {day.isOpen ? (
                  <span className="flex items-center gap-2">
                    <input
                      type="time"
                      aria-label={`${label} opens`}
                      value={day.open}
                      onChange={(e) => set(key, { open: e.target.value })}
                      className={TIME}
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="time"
                      aria-label={`${label} closes`}
                      value={day.close}
                      onChange={(e) => set(key, { close: e.target.value })}
                      className={TIME}
                    />
                  </span>
                ) : (
                  <span className="italic text-gray-400">Closed</span>
                )}
                {dayNote(day) && (
                  <span className="text-xs font-bold text-recommend-green">{dayNote(day)}</span>
                )}
              </div>
            );
          })}
        </div>

        <FormError
          message={
            noneOpen
              ? "Open at least one day — to stop orders for now, pause the store instead."
              : update.isError
                ? update.error.message
                : null
          }
        />
        <FormActions onCancel={onClose} saving={update.isPending} />
      </form>
    </Modal>
  );
}

/** What an unusual pair of times means, rather than refusing it. */
function dayNote(day: DaySchedule): string | null {
  if (!day.isOpen) return null;
  if (day.close === day.open) return "Open 24 hours";
  if (day.close < day.open) return "Closes the next day";
  return null;
}
