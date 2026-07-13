interface StatusCircleProps {
  isComplete: boolean;
}

export default function StatusCircle({ isComplete }: StatusCircleProps) {
  return (
    <span
      aria-hidden="true"
      className={[
        "inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
        isComplete
          ? "border-emerald-500 bg-emerald-500"
          : "border-gray-300 bg-transparent",
      ].join(" ")}
    >
      {isComplete && (
        <svg
          viewBox="0 0 12 12"
          className="h-3 w-3 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 6.5L4.5 8.5L9.5 3.5" />
        </svg>
      )}
    </span>
  );
}