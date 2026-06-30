import VendorGuard from "@/components/organisms/VendorGuard";
// import VendorSidebar from "@/components/organisms/VendorSidebar";
import { DialogProvider } from "@/components/organisms/DialogProvider";
import VendorNavbar from "@/components/molecules/VendorNavbar";

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
        <div className="flex min-h-screen flex-col bg-recommend-amber">
          {/* <VendorSidebar />    to be removed*/}
             <VendorNavbar businessName="Chanor Kitchen" isStoreOpen={false} onToggleStore={undefined} />
          <main className="flex-1 min-w-0 p-4 md:p-0 pt-18 md:pt-0">
            {children}
          </main>
        </div>
      </DialogProvider>
    </VendorGuard>
  );
}
