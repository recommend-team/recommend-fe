"use client";

interface PaginatorProps {
  page: number;
  total: number;
  pageSize: number;
  loadedOnThisPage: number;
  onChange: (next: number) => void;
  label?: string;
}

export default function Paginator({
  page,
  total,
  pageSize,
  loadedOnThisPage,
  onChange,
  label = "items",
}: PaginatorProps) {
  const hasPrev = page > 1;
  const hasNext = page * pageSize < total;
  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-xs font-dm text-gray-500">
        Showing {loadedOnThisPage} of {total} {label}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={!hasPrev}
          className="px-4 py-1.5 rounded-full border border-gray-300 bg-white text-sm font-bold font-dm disabled:opacity-40"
        >
          Previous
        </button>
        <button
          onClick={() => onChange(page + 1)}
          disabled={!hasNext}
          className="px-4 py-1.5 rounded-full bg-recommend-orange text-white text-sm font-bold font-dm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
