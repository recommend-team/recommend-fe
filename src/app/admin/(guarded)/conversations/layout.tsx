"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import ConversationRail from "@/components/organisms/ConversationRail";

export default function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeId = useSelectedLayoutSegment();

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-0 overflow-hidden rounded-2xl border border-black/10 bg-white md:h-[calc(100vh-6rem)]">
      <aside
        className={[
          "min-h-0 w-full shrink-0 border-r border-black/10 bg-white lg:w-[340px]",
          activeId ? "hidden lg:block" : "block",
        ].join(" ")}
      >
        <ConversationRail activeId={activeId} />
      </aside>

      <section
        className={[
          "min-h-0 min-w-0 flex-1",
          activeId ? "block" : "hidden lg:block",
        ].join(" ")}
      >
        {children}
      </section>
    </div>
  );
}
