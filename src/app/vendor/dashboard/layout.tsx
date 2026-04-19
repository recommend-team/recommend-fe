import VendorGuard from "@/components/organisms/VendorGuard";
import VendorSidebar from "@/components/organisms/VendorSidebar";
import { DialogProvider } from "@/components/organisms/DialogProvider";

export const metadata = {
  title: "Vendor · Recommend",
  description: "Manage your storefront, products, and orders on Recommend.",
};

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VendorGuard>
      <DialogProvider>
        <div className="flex min-h-screen bg-recommend-amber">
          <VendorSidebar />
          <main className="flex-1 min-w-0 p-4 md:p-8 pt-18 md:pt-8">
            {children}
          </main>
        </div>
      </DialogProvider>
    </VendorGuard>
  );
}
