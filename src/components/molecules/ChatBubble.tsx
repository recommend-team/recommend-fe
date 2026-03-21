import Image from "next/image";

const ChatBubble = ({ text, avatar }: { text: string; avatar: string }) => (
  <div className="flex items-center">
    <div className="relative z-10">
      <Image
        src={avatar}
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full"
      />
    </div>
    <div className="relative -ml-3 bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm max-w-[180px]">
      <div className="absolute -left-[6px] top-[6px] w-0 h-0 border-r-[10px] border-r-white border-b-[10px] border-b-transparent" />
      <span className="text-xs text-gray-800 font-medium leading-snug">{text}</span>
    </div>
  </div>
);

export default ChatBubble;