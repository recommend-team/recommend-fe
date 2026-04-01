"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
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

      {/* Mobile Sidebar overlay */}
      {isOpen && (
        <div className="fixed top-0 left-0 z-[100] w-screen h-[100dvh] bg-[#FFFFDC]/80 backdrop-blur-lg flex flex-col p-6 animate-in fade-in duration-200">
          <div className="flex flex-row justify-between items-center">
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
              className="p-2 bg-recommend-orange text-white rounded-sm aria-label='Close Menu'"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-start mt-20 px-2 w-full">
            <nav className="flex flex-col gap-10 items-start">
              {headerLabels.map(({ href, name }) => (
                <Link key={name} href={href} onClick={() => setIsOpen(false)}>
                  <Text
                    variant="neighborhoods-title"
                    color="dark"
                    className="hover:text-recommend-orange transition-colors font-medium text-2xl"
                  >
                    {name}
                  </Text>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto mb-10 w-full flex justify-start px-2">
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
      )}
    </>
  );
};

const DesktopHeader = () => {
  return (
    <div className="fixed top-0 hidden lg:flex flex-row justify-between items-center w-full max-w-375 mx-auto p-4">
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
    <header className="w-full top-0 z-50  hover:backdrop-blur-xs">
      <MobileHeader />
      <DesktopHeader />
    </header>
  );
};

export { LandingHeader };