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
 * Opening hours, shown to buyers. They do not open or close the store by themselves —
 * that is the open/closed switch — so this is information, not a schedule.
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

  const backwards = DAYS.filter(
    ({ key }) => week[key].isOpen && week[key].close <= week[key].open
  );

  return (
    <Modal
      title="Opening hours"
      description="Shown to buyers. The store's open/closed switch is separate."
      onClose={onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (backwards.length > 0) return;
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
              </div>
            );
          })}
        </div>

        <FormError
          message={
            backwards.length > 0
              ? `${backwards.map((d) => d.label).join(", ")}: closing must be after opening.`
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
