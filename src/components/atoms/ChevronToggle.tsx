import { motion } from "framer-motion";

interface ChevronToggleProps {
  open: boolean;
}

export default function ChevronToggle({ open }: ChevronToggleProps) {
  return (
    <motion.div
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.3 }}
      className="flex-shrink-0"
    >
      <svg
        viewBox="0 0 20 20"
        className="h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 4l8 6-8 6" />
      </svg>
    </motion.div>
  );
}