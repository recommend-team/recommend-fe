import Image from "next/image";
import { ReactNode } from "react";

export const BackgroundThree = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative w-full overflow-x-clip">
      {/* The Background Image */}
      <div className="absolute inset-0 z-10 bg-recommend-amber">
        <Image
          src="/bg-1.svg"
          alt="Background Pattern"
          priority
          fill
          className="object-cover"
        />
      </div>
      {/* The Content */}
      <main className="relative z-12">{children}</main>
    </div>
  );
};
