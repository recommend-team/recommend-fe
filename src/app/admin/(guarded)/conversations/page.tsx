import { MessagesSquare } from "lucide-react";

export default function ConversationsEmptyState() {
  return (
    <div className="grid h-full place-items-center p-8">
      <div className="max-w-sm text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-recommend-green/10 text-recommend-green">
          <MessagesSquare className="h-6 w-6" />
        </span>
        <p className="mt-4 font-dm text-base font-bold text-gray-900">
          Pick a conversation
        </p>
        <p className="mt-1 font-dm text-sm leading-relaxed text-gray-500">
          Anything the assistant is struggling with sits at the top of the list,
          marked in orange with how long the buyer has been waiting.
        </p>
      </div>
    </div>
  );
}
