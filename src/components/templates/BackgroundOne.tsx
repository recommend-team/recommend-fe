import Image from "next/image";
import { ReactNode } from "react";

export const BackgroundOne = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      
      {/* The Background Image */}
      <div className="fixed inset-0 -z-10 bg-recommend-amber">
        <Image
          src="bg-1.svg"
          alt="Background Pattern"
          priority
          fill    
          className="object-cover"
        />
      </div>

      {/* The Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};