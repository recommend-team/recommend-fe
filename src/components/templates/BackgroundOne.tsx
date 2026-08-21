import Image from "next/image";
import { ReactNode } from "react";

export const BackgroundOne = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-clip">
      {/* The Background Image */}
      <div className="fixed inset-0 z-10 bg-recommend-amber"></div>
      <div className="fixed top-30 md:top-50 md:right-30 right-0 z-11"></div>
      {/* The Content */}
      <main className="relative z-12 max-w-375 mx-auto w-full">{children}</main>
    </div>
  );
};
