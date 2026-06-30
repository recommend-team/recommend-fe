"use client";

import { useState } from "react";
import ChecklistItem, {
  type ChecklistItemData,
} from "@/components/molecules/ChecklistItem";

interface OnboardingChecklistProps {
  businessName: string;
}

const CHECKLIST_ITEMS: Omit<ChecklistItemData, "isComplete">[] = [
  {
    id: "business-profile",
    title: "Setup business profile",
    description: "Makes you look credible and trustworthy.",
  },
  {
    id: "bank-account",
    title: "Add bank account for payouts",
    description: "You won't be able to withdraw earnings without it.",
  },
  {
    id: "menu-item",
    title: "Add your first menu item",
    description: "Add at least one item so customers can order from you.",
  },
  {
    id: "kyc",
    title: "Upload KYC documents",
    description: "Needed for verification.",
  },
];

export default function OnboardingChecklist({
  businessName,
}: OnboardingChecklistProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const items: ChecklistItemData[] = CHECKLIST_ITEMS.map((item) => ({
    ...item,
    isComplete: false,
  }));

  function handleToggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="text-lg font-semibold text-gray-900">
        You&apos;re almost live, {businessName}.
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Complete your setup to start receiving orders from customers across
        Lagos.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}