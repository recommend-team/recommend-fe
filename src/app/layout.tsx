import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ConditionalHeader from "@/components/organisms/ConditionalHeader";
import Analytics from "@/components/organisms/Analytics";
import { SITE_NAME, SITE_URL, pageMetadata } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The defaults every page starts from. `metadataBase` turns the relative paths pages give
// (canonical links, the share image) into full URLs, which link previews require.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  ...pageMetadata({
    title: "Recommend — Order from vendors near you, just by chatting",
    description:
      "Tell Recommend what you want. We find it from vendors near you, take payment securely, and deliver it to your door.",
    path: "/",
  }),
  // Pages that set no canonical of their own must not claim to be the home page.
  alternates: undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        <Providers>
          <ConditionalHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}