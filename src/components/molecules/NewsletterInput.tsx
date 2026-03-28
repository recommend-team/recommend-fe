import { Button } from "@/components/molecules/Button";

export function NewsletterInput() {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-dm text-[#1A1A1A]">Newsletter</span>
      <div className="flex items-center gap-2">
        <input
          type="email"
          placeholder="Enter your email address"
          className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-dm outline-none focus:border-orange-400"
        />
        <Button text="Subscribe" variant="gradient" />
      </div>
    </div>
  );
}