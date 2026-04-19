import AdminGuard from "@/components/organisms/AdminGuard";
import AdminSidebar from "@/components/organisms/AdminSidebar";
import { DialogProvider } from "@/components/organisms/DialogProvider";

export const metadata = {
  title: "Recommend Admin",
  description: "Ecosystem management for the Recommend platform.",
};

export default function AdminGuardedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <DialogProvider>
        <div className="flex min-h-screen bg-recommend-amber">
          <AdminSidebar />
          <main className="flex-1 min-w-0 p-4 md:p-8">{children}</main>
        </div>
      </DialogProvider>
    </AdminGuard>
  );
}
