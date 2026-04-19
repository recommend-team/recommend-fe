import { Clock } from "lucide-react";

export default function AdminComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-dm text-gray-900">
          {title}
        </h1>
        <p className="text-sm font-dm text-gray-500">{description}</p>
      </div>
      <div className="rounded-2xl bg-white border border-[#FFD91D] p-8 md:p-12 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
          <Clock size={24} className="text-recommend-orange" />
        </div>
        <h2 className="text-lg font-bold font-dm text-gray-900">
          Coming in the next update
        </h2>
        <p className="text-sm font-dm text-gray-500 max-w-md">
          This section is being built. The backend endpoints are ready — the UI
          is next.
        </p>
      </div>
    </div>
  );
}
