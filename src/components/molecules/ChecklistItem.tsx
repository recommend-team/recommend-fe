"use client";

import { motion, AnimatePresence } from "framer-motion";
import StatusCircle from "@/components/atoms/StatusCircle";
import ChevronToggle from "@/components/atoms/ChevronToggle";

export interface ChecklistItemData {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
}

interface ChecklistItemProps {
  item: ChecklistItemData;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

export default function ChecklistItem({
  item,
  isOpen,
  onToggle,
}: ChecklistItemProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        <StatusCircle isComplete={item.isComplete} />

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-gray-900">
            {item.title}
          </span>
          <span className="block text-sm text-gray-500">
            {item.description}
          </span>
        </span>

        <ChevronToggle open={isOpen} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-4 py-4 text-sm text-gray-400">
              Form for &ldquo;{item.title}&rdquo; coming soon.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}