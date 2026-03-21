"use client";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Better for navigation
import { Button } from "../molecules/Button";
import { Card } from "../atoms/Card";
import { Text } from "../atoms/Text";

const headerLabels = [
  { name: "Vendor", href: "/vendor" },
  { name: "Rider", href: "/rider" },
  { name: "About us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const MobileHeader = () => {
  const toggleSidebar = () => console.log("Open Sidebar");

  return (
    <div className="flex flex-row justify-between items-center lg:hidden p-4">
      <div className="relative w-32.5 h-8.75">
        <Image
          alt="brand logo"
          priority
          src="/logo-full.svg"
          fill
          className="object-contain"
        />
      </div>
      <button
        onClick={toggleSidebar}
        className="p-2 bg-recommend-orange rounded-sm aria-label='Toggle Menu'"
      >
        <Menu size={24} />
      </button>
    </div>
  );
};

const DesktopHeader = () => {
  return (
    <div className="hidden lg:flex flex-row justify-between items-center w-full max-w-7xl mx-auto p-4">
      {/* Left Spacer to balance the layout */}
      <div className="flex-1" />

      {/* Center Navigation */}
      <Card hoverable={false} variant="regular" padding="small" rounded="sm" className="px-10">
        <div className="flex flex-row items-center gap-8">
          <div className="rounded-full overflow-hidden shrink-0">
            <Image
              alt="brand logo"
              src="/logo-minimal.svg"
              width={35}
              height={35}
            />
          </div>
          <nav className="flex flex-row gap-6">
            {headerLabels.map(({ href, name }) => (
              <Link key={name} href={href}>
                <Text 
                  variant="neighborhoods-title" 
                  color="dark" 
                  className="hover:text-black/70 transition-colors cursor-pointer"
                >
                  {name}
                </Text>
              </Link>
            ))}
          </nav>
        </div>
      </Card>

      {/* Right Action Button */}
      <div className="flex-1 flex justify-end">
        <Button
          variant="gradient"
          text="Start Ordering"
          icon={
            <Image
              alt="whatsapp icon"
              src="/icon_whatsapp.svg"
              width={20}
              height={20}
            />
          }
        />
      </div>
    </div>
  );
};

const LandingHeader = () => {
  return (
    <header className="w-full sticky top-0 z-50  hover:backdrop-blur-xs">
      <MobileHeader />
      <DesktopHeader />
    </header>
  );
};

export { LandingHeader };