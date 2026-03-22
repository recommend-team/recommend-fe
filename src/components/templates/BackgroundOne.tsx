import Image from "next/image";
import { ReactNode } from "react";

export const BackgroundOne = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* The Background Image */}
      <div className="fixed inset-0 z-10 bg-recommend-amber">
        <Image
          src="bg-1.svg"
          alt="Background Pattern"
          priority
          fill
          className="object-cover"
        />
      </div>
      <div className="fixed top-30 md:top-50 md:right-30 right-0 z-11">
        <Image
          src="cloud.svg"
          alt="cloud Pattern"
          priority
          width={130}
          height={130}
          className="w-32.5 h-32.5"
        />
      </div>
      {/* The Content */}
      <main className="relative z-12">{children}</main>
    </div>
  );
};
